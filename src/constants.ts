import { Snippet } from './types';

export const SNIPPETS: Snippet[] = [
  {
    id: 'hello',
    title: 'Habari Dunia',
    desc: 'Mwanzo wa kujifunza',
    lang: 'python',
    code: `# Karibu DevLab Tanzania!
# Hii ni programu yako ya kwanza

jina = "Mwanafunzi"
chuo = "Chuo Kikuu Tanzania"

print("Habari,", jina + "!")
print("Unasoma ICT katika:", chuo)
print()

# Hesabu rahisi
a = 15
b = 7
print("Jumla:", a + b)
print("Tofauti:", a - b)
print("Zao:", a * b)
print("Gawio:", a / b)`
  },
  {
    id: 'loop',
    title: 'Mzunguko (Loop)',
    desc: 'for na while loop',
    lang: 'python',
    code: `# Mzunguko wa for - kuhesabu mara kwa mara

print("=== FOR LOOP ===")
print("Nambari 1 hadi 5:")
for i in range(1, 6):
    print(f"  Nambari: {i}")

print()
print("=== WHILE LOOP ===")
hesabu = 1
while hesabu <= 5:
    nguvu = hesabu ** 2
    print(f"  {hesabu} mraba = {nguvu}")
    hesabu += 1

print()
print("=== LOOP NA ORODHA ===")
masomo = ["Python", "Networking", "Database", "Web Dev"]
for somo in masomo:
    print(f"  Somo: {somo}")`
  },
  {
    id: 'dom',
    title: 'Kubadilisha Rangi',
    desc: 'JavaScript DOM',
    lang: 'javascript',
    code: `// JavaScript - Kubadilisha rangi na DOM
// Hii inafanya kazi kwenye kivinjari (browser)

console.log('=== HESABU ZA MSINGI ===');
const a = 10;
const b = 5;
console.log('10 + 5 =', a + b);
console.log('10 - 5 =', a - b);
console.log('10 × 5 =', a * b);
console.log('10 ÷ 5 =', a / b);

// Array methods
const nambari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const zenye_jozi = nambari.filter(n => n % 2 === 0);
const mraba = nambari.map(n => n * n);
const jumla = nambari.reduce((a, b) => a + b, 0);

console.log('\\n=== ARRAY METHODS ===');
console.log('Nambari zote:', nambari);
console.log('Zenye jozi:', zenye_jozi);
console.log('Miraba:', mraba);
console.log('Jumla yote:', jumla);`
  },
  {
    id: 'card',
    title: 'Kadi ya Mwanafunzi',
    desc: 'Elegant Dark Student Card',
    lang: 'html',
    code: `<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  :root {
    --bg: #0d1117;
    --card-bg: #161b22;
    --accent: #58a6ff;
    --text: #c9d1d9;
    --text-muted: #8b949e;
    --border: #30363d;
    --success: #3fb950;
  }
  
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    color: var(--text);
  }

  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    width: 320px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
    border-color: var(--accent);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent), var(--success));
  }

  .profile-section {
    text-align: center;
    margin-bottom: 24px;
  }

  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1f6feb, #238636);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 800;
    color: white;
    margin: 0 auto 16px;
    border: 4px solid var(--bg);
    box-shadow: 0 0 0 2px var(--border);
  }

  .name {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 4px;
    letter-spacing: -0.5px;
  }

  .major {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
  }

  .id-badge {
    display: inline-block;
    background: rgba(88, 166, 255, 0.1);
    color: var(--accent);
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    margin: 16px 0;
    border: 1px solid rgba(88, 166, 255, 0.2);
  }

  .stats {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    padding-top: 24px;
    margin-top: 8px;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: var(--accent);
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }

  .status-indicator {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    color: var(--success);
    text-transform: uppercase;
  }

  .dot {
    width: 6px;
    height: 6px;
    background: var(--success);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--success);
  }
</style>
</head>
<body>
  <div class="card">
    <div class="status-indicator">
      <div class="dot"></div>
      Active
    </div>
    <div class="profile-section">
      <div class="avatar">DT</div>
      <h2 class="name">DevLab Tanzania</h2>
      <p class="major">Software Engineering</p>
      <div class="id-badge">ID: 2024-001</div>
    </div>
    <div class="stats">
      <div class="stat-item">
        <span class="stat-value">12</span>
        <span class="stat-label">Projects</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">4.9</span>
        <span class="stat-label">GPA</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">A+</span>
        <span class="stat-label">Grade</span>
      </div>
    </div>
  </div>
</body>
</html>`
  }
];
