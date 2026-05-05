Start command: `node src/server.js`

### Frontend (Vercel / Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

---

## 🐛 Troubleshooting

**MongoDB connection refused**
```bash
# Start MongoDB locally
mongod
# Or use an Atlas cloud connection string in .env
```

**CORS errors** — Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

**Port already in use**
```bash
lsof -i :5000   # find process on port 5000
kill -9 <PID>   # kill it
```

**JWT issues** — Clear localStorage in your browser dev tools and re-login.

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m "Add YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Abhishek Sharma**
- GitHub: [@AbhishekSharma9161](https://github.com/AbhishekSharma9161)

---

⭐ If you find this helpful, please give it a star!
