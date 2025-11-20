
# **ContentMint**

AI-powered content assistant built for creators.
Generate topics, write scripts, apply global instructions, and optimize content for YouTube, TikTok, Instagram, and more.

---

## 🚀 **Features**

### **🔹 Script Generation**

Turn any idea into a ready-to-use script using Gemini AI.

### **🔹 Topic Discovery**

Find fresh, relevant topics to create content around.

### **🔹 Custom Master Instructions**

Define global writing style rules (tone, format, persona) to influence all AI outputs.

### **🔹 Script Optimization**

Improve existing scripts for your specific platform (YouTube, TikTok, Reels, Shorts, etc).

### **🔹 Clean, Responsive UI**

Built with Tailwind, HeroUI, and Framer Motion for smooth animations.

---

## 🛠️ **Tech Stack**

| Layer                 | Tools                             |
| --------------------- | --------------------------------- |
| **Frontend**          | Next.js 14 (App Router), React 18 |
| **Styling**           | TailwindCSS, HeroUI               |
| **Animations**        | Framer Motion                     |
| **API / Backend**     | Next.js API Routes                |
| **AI Engine**         | Google Gemini 2.5 Flash           |
| **State & Utilities** | React Hooks, LocalStorage         |

---

## 🔧 **Environment Setup**

### **1. Clone the repo**

```bash
git clone https://github.com/YOUR_USERNAME/ContentMint.git
cd ContentMint
```

### **2. Install dependencies**

```bash
npm install
# or
yarn install
```


---

## ▶️ **Running the App**

### **Development**

```bash
npm run dev
```

Open in browser: **[http://localhost:3000](http://localhost:3000)**

### **Production**

```bash
npm run build
npm start
```

---

## 🤖 **API Routes**

### **1. /api/find-topics**

**Input:**

```json
{
  "description": "fintech trends",
  "instruction": "keep concise",
  "apiKey": "xxxx"
}
```

**Output:**

```json
[
  { "topic": "UPI Growth Analysis", "description": "..." },
  ...
]
```

---

### **2. /api/generate-script**

Generates content scripts based on topic, description, and custom master instructions.

---

### **3. /api/optimize-script**

Enhances or transforms existing scripts based on the user’s optimization request.

---

## ✨ **UI & Animation**

* Smooth transitions powered by **Framer Motion**
* Clean, accessible layout using **TailwindCSS**
* Modern components via **HeroUI**

---

## 🧩 **Key Highlights**

* Fully client-driven interface
* LocalStorage for user preferences
* Modular architecture
* Clear separation between UI and API logic
* Easy to extend with new content tools

---

## 📄 **License**

MIT License — free to use and modify.

---

## 💡 **Contributions**

Pull requests are welcome. Feel free to open issues for bugs or suggestions.

---