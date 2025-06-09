// App.jsx
import { useState, useEffect } from 'react';
import './index.css';

const commands = {
  whoami: `\n👋 Hello World!, I'm Rahul Halder\n\n🧑‍🎓 Electrical Engineering graduate from IIEST Shibpur\n🔐 Cybersecurity enthusiast | 🛠️ Embedded & Automation Developer\n💻 Full Stack Developer | Linux power user | ROS 2 & Raspberry Pi hacker\n🎯 CTF player | Passionate about building secure, intelligent systems\n🎯 Aspiring to join firms like Ernst & Young in security-focused roles\n`,

  "tech-stack": `\n[ C, C++, Python, React, Flask, Tailwind, Docker, ROS, MongoDB, MySQL, Raspberry Pi, ... ]\nVisit GitHub for badge visuals.`,

  "github-stats": `\nGitHub Stats and Streaks are shown below:\n<img src=\"https://nirzak-streak-stats.vercel.app/?user=rahulhalder123-456&theme=dark\" alt=\"GitHub Streak\"/>\n<img src=\"https://github-readme-stats.vercel.app/api/top-langs/?username=rahulhalder123-456&theme=dark&layout=compact\" alt=\"Top Languages\"/>\n`,

  quote: `\n\"First, solve the problem. Then, write the code.\" - John Johnson\n`,

  help: `\nAvailable commands:\n- whoami\n- tech-stack\n- github-stats\n- quote\n- ls\n- cd <dir>\n- pwd\n- clear\n- help\n`,
};

const asciiBanner = `
    ____            __         __         __  __           _     
   / __ \___  _____/ /__  ____/ /__  ____/ /_/ /_  ___    (_)____
  / /_/ / _ \/ ___/ / _ \/ __  / _ \/ __  / __/ __ \/ _ \  / / ___/
 / ____/  __(__  ) /  __/ /_/ /  __/ /_/ / /_/ / / /  __/ / (__  ) 
/_/    \___/____/_/\___/\__,_/\___/\__,_/\__/_/ /_/\___(_)_/____/ 
`;

const virtualFS = {
  home: {
    rahul: {
      projects: {},
      docs: {},
    },
  },
};

export default function App() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [booting, setBooting] = useState(true);
  const [typedCommand, setTypedCommand] = useState('');
  const [asciiVisible, setAsciiVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(['/','home','rahul']);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
      setAsciiVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const getPrompt = () => {
    return `$ rahul@portfolio:${currentPath.join('/').replace('//','/')}$`;
  };

  const getDir = (pathArray, tree = virtualFS) => {
    return pathArray.reduce((dir, segment) => dir?.[segment], tree);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    let output = '';
    const parts = cmd.split(' ');
    const base = parts[0];

    if (base === 'clear') {
      setHistory([]);
      setInput('');
      setTypedCommand('');
      return;
    } else if (base === 'ls') {
      const dir = getDir(currentPath);
      output = Object.keys(dir || {}).join('  ');
    } else if (base === 'cd') {
      const target = parts[1];
      if (!target || target === '.') return;
      if (target === '..') {
        if (currentPath.length > 1) setCurrentPath(prev => prev.slice(0, -1));
      } else {
        const dir = getDir([...currentPath, target]);
        if (dir) setCurrentPath(prev => [...prev, target]);
        else output = `bash: cd: ${target}: No such file or directory`;
      }
    } else if (base === 'pwd') {
      output = currentPath.join('/').replace('//','/');
    } else if (commands[cmd]) {
      output = commands[cmd];
    } else {
      output = `\nCommand not found: ${cmd}\nType 'help' to see available commands.`;
    }

    setHistory(prev => [...prev, `${getPrompt()} ${cmd}`, output]);
    setInput('');
    setTypedCommand('');
  };

  const handleTyping = (value) => {
    setTypedCommand(value);
    setInput(value);
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-6">
        <p>[    0.0001] Booting RahulOS v1.0...</p>
        <p>[    0.0013] Initializing cyber modules...</p>
        <p>[    0.0025] Loading full-stack environment...</p>
        <p>[    0.0037] Engaging AI systems...</p>
        <p>[    0.0049] Welcome to Rahul's Portfolio Terminal.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 text-sm sm:text-base">
      {asciiVisible && <pre className="mb-6 whitespace-pre-wrap text-green-500 text-xs sm:text-sm md:text-base">{asciiBanner}</pre>}
      <div className="whitespace-pre-wrap">
        {history.map((line, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
      <form onSubmit={handleCommand} className="mt-4">
        <span className="text-green-300">{getPrompt()} </span>
        <input
          type="text"
          value={typedCommand}
          onChange={(e) => handleTyping(e.target.value)}
          className="bg-transparent outline-none text-green-200 w-3/4 animate-typing"
          autoFocus
        />
      </form>
    </div>
  );
}