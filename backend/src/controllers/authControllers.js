import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { upsertStreamUser } from '../lib/stream.js';


// API for signUp
const SignUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if(!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if(password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const isValid = validator.isEmail(email);
    if(!isValid) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

    const newUser = await User.create({ 
        username, 
        email, 
        password,
        profilePic: randomAvatar
        });
 
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.username,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created successfully for ${newUser.username }`);
        } catch (error) {
            console.log('Error creating Stream user:', error);
        }

        const token = jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        
        res.cookie('jwt', token, 
            { httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
                sameSite: 'strict'
            });

    res.status(201).json({ success:true, user: newUser, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if(!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        
        res.cookie('jwt', token, 
            { httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
                sameSite: 'strict'
            });
 
            res.status(200).json({ success:true, user, token, message: 'Login successful' });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const logout = (req, res) => {
  res.clearCookie('jwt')
    res.status(200).json({ success: true, message: 'Logout successful' });
}

const onBoard = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, bio, nativeLang, learningLang, location } = req.body;

        if(!username || !nativeLang || !learningLang || !location) {
            return res.status(400).json({
                message: 'Please fill all required fields',
                missingFields:[
                    !username && 'username',
                    !bio && 'bio',
                    !nativeLang && 'nativeLang',
                    !learningLang && 'learningLang',
                    !location && 'location',    
                ].filter(Boolean)
             });
        }

        const updatedUser= await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if(!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        try {
             await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.username,
            image: updatedUser.profilePic || "",
        });
        console.log(`Stream user updated successfully for ${updatedUser.username }`);
        } catch (error) {
            console.log('Error updating Stream user:', error);  
        }  

        res.status(200).json({ success: true, user:updatedUser, message: 'Onboarding completed successfully' });
    } catch (error) {
        
    }
}

export { SignUp, login, logout, onBoard};