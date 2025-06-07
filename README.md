# Aurora

A powerful and feature-rich WhatsApp bot designed for seamless automation and enhanced user experience.

> ⚠️ **Note:** Aurora is still in active development. Features may change frequently, and bugs may exist. Contributions and feedback are welcome!

---

## 🚀 Getting Started

Follow these steps to get Aurora up and running on your local machine.

### Prerequisites

* Go 1.23.0 or later installed  
* Git installed
### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/kaidenki/whatsapp-bot.git aurora
    cd aurora
    ```

2. **Copy environment variables template:**
    ```bash
    cp .env.example .env
    ```
    *Make sure to fill out the `.env` file with your credentials.*

3. **Install dependencies:**
    ```bash
    go install
    ```

4. **(Optional but recommended) Tidy modules:**
    ```bash
    go mod tidy
    ```

5. **Run the bot:**

---

### On Linux/macOS

Use the provided shell script to run the bot with auto-restart:

```bash
chmod +x run.sh
./run.sh
```
---
### On Windows

Use the provided bat script to run the bot with auto-restart:

```bash
chmod +x run.sh
./run.sh
```
---
## 💬 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Feel free to fork and improve Aurora!

---

## 🙏 Credits & Acknowledgments

Special thanks to the developers and libraries that made this project possible:

* [**@DikaArdnt**](https://github.com/DikaArdnt) – Creator of [go-readsw](https://github.com/DikaArdnt/go-readsw).  
* [**@fckvania**](https://github.com/fckvania) – Creator of [MaoGo](https://github.com/fckvania/MaoGo).  
* [**@tulir**](https://github.com/tulir) – Developer of [whatsmeow](https://github.com/tulir/whatsmeow).

---

## ⚠️ Disclaimer

WhatsApp name, its variations, and the logo are registered trademarks of meta. I have nothing to do with the registered trademark.  
Aurora is not made by WhatsApp Inc. Misusing it might result in your WhatsApp account being banned!  
**I am not responsible for banning your account.**  
Use aurora at your own risk by keeping this warning in mind.

---

## 📜 License

This project is not yet licensed but don’t use my code without giving me credits or my permission :)
