import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const dataDir = path.join(projectRoot, 'data');

const app = express();
app.use(cors());
app.use(express.json());

// 静态文件服务 — 所有页面和资源都在根目录
app.use(express.static(projectRoot));

// Helper to ensure file exists
async function ensureFile(filePath, defaultContent = '[]') {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, defaultContent, 'utf-8');
    }
}

// -----------------
// Worlds API
// -----------------

// Get all worlds
app.get('/api/worlds', async (req, res) => {
    try {
        const filePath = path.join(dataDir, 'worlds.json');
        await ensureFile(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save all worlds
app.post('/api/worlds', async (req, res) => {
    try {
        const filePath = path.join(dataDir, 'worlds.json');
        await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------
// Chapters API
// -----------------

// Get chapters for a specific world
app.get('/api/chapters/:worldId', async (req, res) => {
    try {
        const worldId = req.params.worldId;
        const filePath = path.join(dataDir, 'chapters', `${worldId}.json`);
        await ensureFile(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save chapters for a specific world
app.post('/api/chapters/:worldId', async (req, res) => {
    try {
        const worldId = req.params.worldId;
        const filePath = path.join(dataDir, 'chapters', `${worldId}.json`);
        await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🌌 MAERS-Story 构灵人后台已启动`);
    console.log(`管理面板地址: http://localhost:${PORT}`);
    console.log(`关闭请按 Ctrl + C`);
    console.log(`==============================================\n`);
});
