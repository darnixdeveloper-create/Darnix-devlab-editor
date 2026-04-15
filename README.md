# DevLab Tanzania - Mhariri wa Kodi Mtandaoni

Huu ni mradi wa mhariri wa kodi (Code Editor) uliotengenezwa kwa kutumia **React**, **TypeScript**, na **Firebase**. Inaruhusu watumiaji kuandika na kuendesha kodi za Python, JavaScript, HTML, na SQL moja kwa moja kwenye kivinjari.

## 🚀 Jinsi ya Kuanza (Local Setup)

Ili kuendesha mradi huu kwenye kompyuta yako:

1. **Download kodi:** Download mradi huu kama ZIP au tumia `git clone`.
2. **Install Dependencies:** Fungua terminal kwenye folder la mradi na andika:
   ```bash
   npm install
   ```
3. **Weka Firebase:** Hakikisha una faili la `firebase-applet-config.json` kwenye folder kuu (root).
4. **Endesha Programu:**
   ```bash
   npm run dev
   ```
5. Fungua `http://localhost:3000` kwenye kivinjari chako.

## 🌐 Jinsi ya Kuiweka Mtandaoni (Deployment)

Ili watu wengine waweze kuiona website yako (isikae blank kwenye GitHub):

### Njia ya 1: Vercel (Inapendekezwa)
1. Nenda [vercel.com](https://vercel.com) na tengeneza akaunti.
2. Unganisha akaunti yako ya GitHub.
3. Chagua mradi huu wa `DevLab-Tanzania`.
4. Vercel itatambua automatic kuwa ni mradi wa **Vite**.
5. Bonyeza **Deploy**. Baada ya dakika 1, utapewa link ya website yako!

### Njia ya 2: Netlify
1. Nenda [netlify.com](https://netlify.com).
2. Drag and drop folder la `dist` (baada ya kufanya `npm run build`) au unganisha na GitHub.

## 🛠 Teknolojia Zilizotumika
- **Frontend:** React 19, Tailwind CSS 4, Motion (framer-motion).
- **Icons:** Lucide React.
- **Backend/Database:** Firebase (Auth & Firestore).
- **Build Tool:** Vite.

## 📝 Maelezo ya Ziada
Mradi huu umetengenezwa kwa muundo wa **Modular Architecture**, kumaanisha kodi zimegawanywa vizuri (Components, Services, Constants) ili iwe rahisi kuongeza vipengele vipya bila kuharibu mfumo uliopo.

---
© 2024 DevLab Tanzania.
