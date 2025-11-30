import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  icon: string;
  owned: number;
}

interface Character {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  requirement: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  emoji: string;
}

const Index = () => {
  const [coins, setCoins] = useState(0);
  const [totalChops, setTotalChops] = useState(0);
  const [coinsPerClick, setCoinsPerClick] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: '1', name: 'Острый топор', cost: 10, multiplier: 2, icon: 'Axe', owned: 0 },
    { id: '2', name: 'Супер топор', cost: 50, multiplier: 5, icon: 'Zap', owned: 0 },
    { id: '3', name: 'Мега пила', cost: 200, multiplier: 10, icon: 'Sparkles', owned: 0 },
    { id: '4', name: 'Турбо дрель', cost: 500, multiplier: 25, icon: 'Rocket', owned: 0 },
  ]);

  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: 'Бобр-новичок', description: 'Только начинает свой путь', emoji: '🦫', unlocked: true, requirement: 0 },
    { id: '2', name: 'Бобр-мастер', description: 'Опытный дровосек', emoji: '🦦', unlocked: false, requirement: 100 },
    { id: '3', name: 'Золотой бобр', description: 'Легенда леса', emoji: '⭐', unlocked: false, requirement: 500 },
    { id: '4', name: 'Космо-бобр', description: 'Покоритель вселенной', emoji: '🚀', unlocked: false, requirement: 1000 },
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { name: 'Бобр-чемпион', score: 15420, emoji: '🏆' },
    { name: 'Лесной король', score: 12350, emoji: '👑' },
    { name: 'Супер дровосек', score: 9870, emoji: '⚡' },
    { name: 'Мастер пилы', score: 7650, emoji: '🪚' },
    { name: 'Быстрый бобр', score: 5430, emoji: '💨' },
    { name: 'Вы', score: totalChops, emoji: '🦫' },
  ].sort((a, b) => b.score - a.score));

  const handleChop = () => {
    setCoins(coins + coinsPerClick);
    setTotalChops(totalChops + 1);
    setIsShaking(true);
    
    const newCharacters = characters.map(char => {
      if (!char.unlocked && totalChops >= char.requirement) {
        toast.success(`🎉 Разблокирован персонаж: ${char.name}!`);
        return { ...char, unlocked: true };
      }
      return char;
    });
    setCharacters(newCharacters);
    
    setTimeout(() => setIsShaking(false), 300);
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (coins >= upgrade.cost) {
      setCoins(coins - upgrade.cost);
      setCoinsPerClick(coinsPerClick + upgrade.multiplier);
      
      const updatedUpgrades = upgrades.map(u => {
        if (u.id === upgrade.id) {
          const newCost = Math.floor(u.cost * 1.5);
          toast.success(`🎯 Куплено: ${u.name}!`);
          return { ...u, cost: newCost, owned: u.owned + 1 };
        }
        return u;
      });
      setUpgrades(updatedUpgrades);
    } else {
      toast.error('Недостаточно монет! 💰');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-100 to-green-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4 drop-shadow-lg">
            🦫 Beaver Ton 🪵
          </h1>
          <div className="flex justify-center gap-8 mb-6">
            <Card className="px-6 py-3 bg-accent border-4 border-primary">
              <div className="flex items-center gap-2">
                <span className="text-3xl">💰</span>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Монеты</p>
                  <p className="text-3xl font-bold text-accent-foreground">{coins}</p>
                </div>
              </div>
            </Card>
            <Card className="px-6 py-3 bg-secondary border-4 border-primary">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🪓</span>
                <div>
                  <p className="text-sm text-secondary-foreground font-medium">За клик</p>
                  <p className="text-3xl font-bold text-secondary-foreground">{coinsPerClick}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-card border-4 border-primary">
            <TabsTrigger value="game" className="text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Gamepad2" className="mr-2" />
              Игра
            </TabsTrigger>
            <TabsTrigger value="shop" className="text-lg font-bold data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Icon name="Store" className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              <Icon name="Trophy" className="mr-2" />
              Рекорды
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-amber-100 to-green-100 border-4 border-primary">
              <div className="text-center">
                <div className="mb-6 relative">
                  <button
                    onClick={handleChop}
                    className={`transition-all cursor-pointer bg-transparent border-none p-0 ${
                      isShaking ? 'animate-shake' : 'hover:scale-105'
                    }`}
                  >
                    <img 
                      src="https://cdn.poehali.dev/files/db26e5e7-d38a-4b7d-ab27-e428e55218e8.jpg" 
                      alt="Beaver chopping"
                      className="w-80 h-auto rounded-2xl shadow-2xl"
                    />
                  </button>
                </div>
                <h2 className="text-4xl font-bold text-primary mb-2">
                  Руби дерево!
                </h2>
                <p className="text-xl text-muted-foreground">
                  Кликай на дерево и зарабатывай монеты
                </p>
                <div className="mt-6">
                  <Badge variant="outline" className="text-xl px-6 py-2 bg-white">
                    Всего рубок: {totalChops}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-4 border-primary">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🦫</span>
                Твои персонажи
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characters.map((char) => (
                  <Card
                    key={char.id}
                    className={`p-4 text-center transition-all ${
                      char.unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-500 animate-pulse-glow'
                        : 'bg-gray-200 border-2 border-gray-400 opacity-60'
                    }`}
                  >
                    <div className="text-5xl mb-2">{char.unlocked ? char.emoji : '🔒'}</div>
                    <h4 className="font-bold text-sm mb-1">{char.name}</h4>
                    <p className="text-xs text-muted-foreground">{char.description}</p>
                    {!char.unlocked && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Нужно: {char.requirement} рубок
                      </Badge>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <Card className="p-6 bg-card border-4 border-accent">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="text-4xl">🏪</span>
                Магазин улучшений
              </h3>
              <div className="grid gap-4">
                {upgrades.map((upgrade) => (
                  <Card
                    key={upgrade.id}
                    className="p-6 bg-gradient-to-r from-white to-yellow-50 border-2 border-amber-300 hover:border-amber-500 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">
                          <Icon name={upgrade.icon as any} size={48} className="text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-1">{upgrade.name}</h4>
                          <p className="text-muted-foreground">
                            +{upgrade.multiplier} монет за клик
                          </p>
                          {upgrade.owned > 0 && (
                            <Badge variant="secondary" className="mt-1">
                              Куплено: {upgrade.owned}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => buyUpgrade(upgrade)}
                        disabled={coins < upgrade.cost}
                        className="text-xl px-8 py-6 bg-accent hover:bg-accent/90"
                      >
                        <span className="mr-2">💰</span>
                        {upgrade.cost}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="p-6 bg-card border-4 border-secondary">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="text-4xl">🏆</span>
                Таблица рекордов
              </h3>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <Card
                    key={index}
                    className={`p-4 transition-all ${
                      entry.name === 'Вы'
                        ? 'bg-gradient-to-r from-yellow-200 to-yellow-100 border-4 border-yellow-500 animate-pulse-glow'
                        : index === 0
                        ? 'bg-gradient-to-r from-amber-200 to-yellow-200 border-2 border-amber-400'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold w-12">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="text-3xl">{entry.emoji}</div>
                        <div>
                          <h4 className="text-xl font-bold">{entry.name}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{entry.score}</p>
                        <p className="text-sm text-muted-foreground">рубок</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;