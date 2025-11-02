# HuddleMe - Connect with Nearby People in Real-Time

HuddleMe is a proximity-based social networking app that uses Bluetooth Low Energy (BLE) technology to help you discover and connect with people nearby who share your interests.

## 🚀 Features

- **Real-time BLE Scanning**: Discover nearby users using Bluetooth Low Energy
- **Distance Estimation**: RSSI-based distance calculation (Near, Medium, Far)
- **Auto-Connect**: Automatically send connection requests to users with matching interests
- **Interest Matching**: Find people who share your hobbies and interests
- **Live Radar View**: Visual representation of nearby users with distance indicators
- **Background Scanning**: Continuous discovery even when app is in background
- **Chat & Messaging**: Connect and chat with matched users
- **Meetup Proposals**: Suggest venues and times to meet in person
- **Privacy Controls**: Full control over visibility and auto-connect settings

## 🌐 Live Demo

Visit the live demo at: **[huddlemedemo.netlify.app](https://huddlemedemo.netlify.app)**

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **BLE Integration**: Web Bluetooth API simulation
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Hosting**: Netlify (free tier)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/huddlemedemo.git

# Navigate to project directory
cd huddlemedemo

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚢 Deployment

See [DEPLOYMENT_FREE.md](./DEPLOYMENT_FREE.md) for detailed instructions on deploying to free hosting platforms.

### Quick Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set site name to "huddlemedemo"
4. Deploy automatically

Your site will be live at: `huddlemedemo.netlify.app`

## 📱 How It Works

1. **Enable Bluetooth**: Turn on BLE scanning in settings
2. **Set Interests**: Add your hobbies and interests
3. **Discover**: App scans for nearby users automatically
4. **Connect**: Send connection requests or enable auto-connect
5. **Chat**: Message with matched connections
6. **Meet**: Propose meetups at nearby venues

## 🔒 Privacy & Security

- All BLE scanning happens locally on device
- Users control their visibility settings
- No location data is stored without consent
- End-to-end encrypted messaging (coming soon)

## 📄 License

MIT License - feel free to use this project for learning or building your own apps!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, visit our website or open an issue on GitHub.
