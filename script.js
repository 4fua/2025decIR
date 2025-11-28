const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxfEUWltEifjCZKrBXUMM-oY7JLfT3LFqDPTAss3Ls2ptN1JzEMoZ2cz0weRohhghm54Q/exec';

const IS_RANKING_PUBLIC = true;
const IS_SUBMISSION_OPEN = true;

const settingsDatabase = {
  "IIDX": {
    songs: [
      "AA",
      "B4U(BEMANI FOR YOU MIX)"
    ],
    difficulties: [
      "BEGINNER",
      "NORMAL",
      "HYPER",
      "ANOTHER",
      "LEGGENDARIA"
    ]
  },
  "SDVX": {
    songs: [
      "量子の海のリントヴルム",
      "Übertreffen"
    ],
    difficulties: [
      "NOV",
      "ADV",
      "EXH",
      "MXM相当"
    ]
  },
  "CHUNITHM": {
    songs: [
      "volcanic",
      "雪男"
    ],
    difficulties: [
      "BAS",
      "ADV",
      "EXP",
      "MAS"
    ]
  },
  "maimai": {
    songs: [
      "トランスダンスアナーキー",
      "Energizing Flame"
    ],
    difficulties: [
      "BAS",
      "ADV",
      "EXP",
      "MAS"
    ]
  },
  "オンゲキ": {
    songs: [
      "まっすぐ→→→ストリーム！",
      "Climax"
    ],
    difficulties: [
      "BAS",
      "ADV",
      "EXP",
      "MAS"
    ]
  },
  "太鼓の達人": {
    songs: [
      "Black Rose Apostle",
      "〆ドレー2000"
    ],
    difficulties: [
      "かんたん",
      "ふつう",
      "むずかしい",
      "おに",
      "おに(裏)"
    ]
  },
  "ARCAEA": {
    songs: [
      "Crimson Throne",
      "Vulcanus"
    ],
    difficulties: [
      "PST",
      "PRS",
      "FTR"
    ]
  },
  "プロセカ": {
    songs: [
      "マトリョシカ",
      "Brand New Day"
    ],
    difficulties: [
      "EASY",
      "NORMAL",
      "HARD",
      "EXPERT",
      "MASTER",
      "APPEND"
    ]
  },
  "Phigros": {
    songs: [
      "インフェルノシティ",
      "Ad astra per astera"
    ],
    difficulties: [
      "EZ",
      "HD",
      "IN"
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const gameSelect = document.getElementById('gameSelect');
  const songSelect = document.getElementById('songSelect');
  const difficultySelect = document.getElementById('difficultySelect');
  const form = document.getElementById('scoreForm');
  const statusMessage = document.getElementById('statusMessage');
  const submitButton = document.getElementById('submitButton');
  const rankingContainer = document.getElementById('rankingContainer');

  function setStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? 'error' : 'success';
  }

  gameSelect.addEventListener('change', () => {
    const selectedGame = gameSelect.value;
    
    songSelect.innerHTML = ''; 
    difficultySelect.innerHTML = '';

    if (selectedGame && settingsDatabase[selectedGame]) {
      const settings = settingsDatabase[selectedGame];
      
      songSelect.disabled = false;
      const placeholderSong = document.createElement('option');
      placeholderSong.value = "";
      placeholderSong.textContent = "-- 曲名を選んでください --";
      songSelect.appendChild(placeholderSong);
      
      settings.songs.forEach(songName => {
        const option = document.createElement('option');
        option.value = songName;
        option.textContent = songName;
        songSelect.appendChild(option);
      });
      
      difficultySelect.disabled = false;
      const placeholderDiff = document.createElement('option');
      placeholderDiff.value = "";
      placeholderDiff.textContent = "-- 難易度を選んでください --";
      difficultySelect.appendChild(placeholderDiff);

      settings.difficulties.forEach(diffName => {
        const option = document.createElement('option');
        option.value = diffName;
        option.textContent = diffName;
        difficultySelect.appendChild(option);
      });

    } else {
      songSelect.disabled = true;
      const placeholderSong = document.createElement('option');
      placeholderSong.value = "";
      placeholderSong.textContent = "-- まず機種を選んでください --";
      songSelect.appendChild(placeholderSong);

      difficultySelect.disabled = true;
      const placeholderDiff = document.createElement('option');
      placeholderDiff.value = "";
      placeholderDiff.textContent = "-- まず機種を選んでください --";
      difficultySelect.appendChild(placeholderDiff);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    if (!IS_SUBMISSION_OPEN) {
      setStatus("スコア送信期間は終了しました！結果発表をお待ちください。", true);
      return;
    }

    const tidValue = document.getElementById('tidInput').value.trim();
    const nameValue = document.getElementById('nameInput').value.trim();
    
    const tidNormalized = tidValue.toLowerCase();

    if (!tidNormalized || !nameValue) {
      setStatus("IDと名前は両方必須です（空白のみは不可）。", true);
      return;
    }

    const scoreValue = document.getElementById('scoreInput').value;

    if (!scoreValue || scoreValue <= 0) {
      setStatus("スコアは1以上の数値を入力してください。", true);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    setStatus('');
    
    const formData = {
      game: document.getElementById('gameSelect').value,
      song: document.getElementById('songSelect').value,
      difficulty: document.getElementById('difficultySelect').value,
      tid: tidNormalized,
      name: nameValue,
      score: scoreValue,
      comment: document.getElementById('commentInput').value
    };

    fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      mode: 'no-cors'
    })
    .then(response => {
      setStatus('スコアを送信しました！最新のランキングを読み込みます...', false);
      
      document.getElementById('gameSelect').value = "";
      document.getElementById('scoreInput').value = "";
      document.getElementById('commentInput').value = "";

      songSelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      songSelect.disabled = true;
      difficultySelect.innerHTML = '<option value="">-- まず機種を選んでください --</option>';
      difficultySelect.disabled = true;
      
      loadRankings(); 
    })
    .catch(error => {
      setStatus(`ネットワークエラー: ${error.message}`, true);
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = '送信';
    });
  });

  function displayRankings(data) {
    rankingContainer.innerHTML = '';
    
    if (data.length === 0) {
      rankingContainer.innerHTML = '<p>まだスコアデータがありません。</p>';
      return;
    }

    const groupedByGame = data.reduce((acc, record) => {
      if (!record.game) return acc;
      const game = record.game;
      if (!acc[game]) {
        acc[game] = [];
      }
      acc[game].push(record);
      return acc;
    }, {});

    // settingsDatabaseのキー順（記述順）でループ
    Object.keys(settingsDatabase).forEach(gameName => {
      if (!groupedByGame[gameName]) return;

      const gameSection = document.createElement('div');
      gameSection.className = 'game-ranking';
      
      const gameTitle = document.createElement('h3');
      gameTitle.textContent = gameName;
      gameSection.appendChild(gameTitle);

      const groupedBySong = groupedByGame[gameName].reduce((acc, record) => {
        if (!record.song) return acc;
        const song = record.song;
        if (!acc[song]) {
          acc[song] = [];
        }
        acc[song].push(record);
        return acc;
      }, {});

      // settingsDatabase内のsongs配列の順序でループ
      const definedSongs = settingsDatabase[gameName].songs;
      definedSongs.forEach(songName => {
        if (!groupedBySong[songName]) return;

        const songSection = document.createElement('div');
        songSection.className = 'song-ranking';
        
        const songTitle = document.createElement('h4');
        songTitle.textContent = songName;
        songSection.appendChild(songTitle);

        const groupedByDifficulty = groupedBySong[songName].reduce((acc, record) => {
          if (!record.difficulty) return acc;
          const difficulty = record.difficulty;
          if (!acc[difficulty]) {
            acc[difficulty] = [];
          }
          acc[difficulty].push(record);
          return acc;
        }, {});

        // settingsDatabase内のdifficulties配列の順序でループ
        const definedDifficulties = settingsDatabase[gameName].difficulties;
        definedDifficulties.forEach(difficultyName => {
          if (!groupedByDifficulty[difficultyName]) return;

          const difficultySection = document.createElement('div');
          difficultySection.className = 'difficulty-ranking';
          
          const difficultyTitle = document.createElement('h5');
          difficultyTitle.textContent = difficultyName;
          difficultySection.appendChild(difficultyTitle);
          
          const highestScores = new Map();
          
          for (const record of groupedByDifficulty[difficultyName]) {
            if (!record.tid || !record.name || record.score === null || record.score === undefined) continue;
            
            const tidNormalized = record.tid.toLowerCase();
            
            if (!highestScores.has(tidNormalized) || Number(record.score) > Number(highestScores.get(tidNormalized).score)) {
              highestScores.set(tidNormalized, record);
            }
          }
          
          const filteredRecords = Array.from(highestScores.values());
          
          const sortedRecords = filteredRecords.sort((a, b) => Number(b.score) - Number(a.score));

          const list = document.createElement('ol');
          sortedRecords.forEach((record, index) => {
            const item = document.createElement('li');
            
            const rankSpan = document.createElement('span');
            rankSpan.className = 'rank';
            rankSpan.textContent = (index + 1) + '.';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'name';
            nameSpan.textContent = record.name;

            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'score';
            scoreSpan.textContent = record.score;
            
            item.appendChild(rankSpan);
            item.appendChild(nameSpan);
            item.appendChild(scoreSpan);
            
            if (record.comment) {
              const commentDiv = document.createElement('div');
              commentDiv.className = 'comment-bubble';
              commentDiv.textContent = record.comment;
              item.appendChild(commentDiv);
            }
            
            list.appendChild(item);
          });
          
          difficultySection.appendChild(list);
          songSection.appendChild(difficultySection);
        });
        
        gameSection.appendChild(songSection);
      });
      
      rankingContainer.appendChild(gameSection);
    });
  }

  function loadRankings() {
    
    if (!IS_RANKING_PUBLIC) {
      rankingContainer.innerHTML = '<p>ランキング公開を停止しました！結果発表日をお待ちください。</p>';
      rankingContainer.style.color = '#333'; 
      return; 
    }

    rankingContainer.innerHTML = '<p>ランキングを読み込み中...</p>';
    rankingContainer.style.color = '#333';
    
    fetch(GAS_WEB_APP_URL) 
      .then(response => {
        if (!response.ok) {
          throw new Error('ネットワーク応答がありませんでした。');
        }
        return response.json();
      })
      .then(data => {
        if (data.result === 'error') {
          throw new Error('GAS側でエラーが発生: ' + data.message);
        }
        displayRankings(data);
      })
      .catch(error => {
        rankingContainer.innerHTML = '<p>ランキングの読み込みに失敗しました: ' + error.message + '</p>';
        rankingContainer.style.color = 'red';
      });
  }

  loadRankings();

});
