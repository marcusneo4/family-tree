# 🌳 Family Tree Website

A beautiful, interactive family tree website that runs entirely locally - no Firebase, no authentication, no cloud storage needed!

## ✨ Features

- **No Login Required**: All data stored locally in your browser
- **Interactive Tree**: Add, edit, and delete family members
- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile
- **Persistent Storage**: Data saved in browser's localStorage
- **Easy to Use**: Simple, intuitive interface

## 🚀 Quick Start

### Method 1: Python Server (Recommended)

1. Make sure you have Python installed (Python 3.x)
2. Open a terminal/command prompt in this folder
3. Run:
   ```bash
   python server.py
   ```
4. Your browser will automatically open to `http://localhost:8000`

### Method 2: Direct File Opening

Simply double-click `index.html` to open it in your browser!

## 📖 How to Use

1. **Start Fresh**: The website comes with a sample family member
2. **Add Members**: Click "+ Add Family Member" button
3. **Add Children**: Click "+ Add Child" on any family member card
4. **Edit Members**: Click "Edit" button on any card
5. **Delete Members**: Click "Delete" button (will remove member and all descendants)
6. **Expand/Collapse**: Use the Expand All / Collapse All buttons

## 💾 Data Storage

- All data is stored in your browser's localStorage
- Data persists across sessions
- No server-side storage or database required
- Your family tree data stays completely private on your device

## 🎨 Customization

Feel free to customize:
- **styles.css**: Change colors, fonts, and layout
- **script.js**: Modify functionality and add features
- **index.html**: Update structure and content

## 📝 Technical Details

- **Pure Frontend**: HTML, CSS, JavaScript
- **No Dependencies**: No frameworks or libraries required
- **No Backend**: No database, no authentication, no API calls
- **Lightweight**: Fast loading and responsive

## 🔒 Privacy

- No data sent to any server
- No tracking or analytics
- Everything runs locally
- Your family information stays on your device

## 🛠️ Troubleshooting

**Port already in use?**
- Edit `server.py` and change `PORT = 8000` to another number (e.g., 8001, 3000)

**Data not saving?**
- Make sure your browser allows localStorage
- Check browser's privacy settings

**Browser won't open automatically?**
- Manually navigate to `http://localhost:8000` in your browser

## 📄 License

Free to use and modify for personal and commercial projects!

---

**Enjoy building your family tree! 🌳👨‍👩‍👧‍👦**

