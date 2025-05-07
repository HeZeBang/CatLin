// import { A, Badge, BadgeSplitted, Button, Checkbox, IconButton, Input, Radio } from "nes-ui-react";
import { PixelBorder, Progress, Modal, Header, Footer, Spacer } from "nes-ui-react";
import { SVGProps, useEffect, useState } from "react";
import { ICat } from "@/models/cat";

// Keep dummyCats as templates
const dummyCats = [
  {
    avatar: "black",
    name: "煤炭",
    happiness: 0.5,
    hunger: 0.2,
    owned: true,
    description: "好黑啊，像煤炭一样"
  },
  {
    avatar: "xl",
    name: "豆沙包",
    happiness: 0.8,
    hunger: 0.6,
    owned: false,
    description: "味道怎么样呢～"
  },
  {
    avatar: "orange",
    name: "胖橘",
    happiness: 0.8,
    hunger: 0.1,
    owned: true,
  },
  {
    avatar: "blue",
    name: "蓝猫",
    happiness: 0.1,
    hunger: 0.9,
  },
  {
    avatar: "pattern",
    name: "花岗岩",
    happiness: 0.7,
    hunger: 0.3,
    owned: false,
  },
  {
    avatar: "white",
    name: "白猫",
    happiness: 0.9,
    hunger: 0.4,
    owned: true,
  },
  {
    avatar: "gray",
    name: "灰猫",
    happiness: 0.6,
    hunger: 0.5,
    owned: false,
  },
  {
    avatar: "yellow",
    name: "罗勒",
    happiness: 0.8,
    hunger: 0.2,
    owned: true,
    description: "是男孩子哦"
  }
] as ICat[]

const getProgressColor = (value: number) => {
  if (value >= 0.7) return "success";
  if (value >= 0.4) return "warning";
  return "error";
}

export default function Gallery() {
  const [cats, setCats] = useState<ICat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<ICat | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('/api/cat');
        if (!response.ok) throw new Error('Failed to fetch cats');
        const data = await response.json();
        setCats(data);
      } catch (error) {
        console.error('Error fetching cats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-4 justify-center gap-4 p-4 min-h-fit">
      {dummyCats.map((template, index) => {
        const userCat = cats.find(cat => cat.avatar === template.avatar);
        const displayCat = userCat || template;
        
        return (
          <PixelBorder doubleRoundCorners className="w-full mb-2 break-inside-avoid" key={index}
            style={{
              opacity: displayCat.owned ? 1 : 0.4
            }}
          >
            <div className="flex flex-row sm:flex-col justify-center items-center active:scale-95"
              onClick={() => {
                setSelectedCat(displayCat);
                setModalOpen(true);
              }}
            >
              <img src={`/avatars/${displayCat.avatar}.png`} className="max-w-28 m-5" />
              <div className="flex flex-col mx-2 my-2">
                <p className="text-2xl flex align-middle">{displayCat.name}{displayCat.owned ? "" : "（未获得）"}</p>
                {displayCat.description && <span className="text-base opacity-80">{displayCat.description}</span>}
                <div className="text-md flex justify-center items-center">
                  <span className="flex-auto min-w-[3.5em] text-nowrap">心情</span>
                  <Progress value={displayCat.happiness}
                    color={getProgressColor(displayCat.happiness)}
                    style={{
                      maxHeight: "10px"
                    }} />
                </div>
                <div className="text-md flex justify-center items-center">
                  <span className="flex-auto min-w-[3.5em] text-nowrap">饱食度</span>
                  <Progress value={displayCat.hunger}
                    color={getProgressColor(displayCat.hunger)}
                    style={{
                      maxHeight: "10px"
                    }} />
                </div>
              </div>
            </div>
          </PixelBorder>
        );
      })}

      <Modal open={modalOpen} title="猫猫详情" className="max-w-sm">
        <Header>
          <span className="text-lg">猫猫详细信息</span>
        </Header>
        <div className="flex flex-col gap-3 p-3">
          {selectedCat && (
            <>
              <div className="flex justify-center">
                <img src={`/avatars/${selectedCat.avatar}.png`} className="max-w-32" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">{selectedCat.name}</span>
                  <span className={`nes-badge ${selectedCat.owned ? "is-primary" : "is-error"}`}>
                    <span>{selectedCat.owned ? "已获得" : "未获得"}</span>
                  </span>
                </div>
                {selectedCat.description && (
                  <p className="text-base opacity-80">{selectedCat.description}</p>
                )}
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>心情</span>
                      <span>{Math.round(selectedCat.happiness * 100)}%</span>
                    </div>
                    <Progress value={selectedCat.happiness}
                      color={getProgressColor(selectedCat.happiness)}
                      style={{
                        maxHeight: "10px"
                      }} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>饱食度</span>
                      <span>{Math.round(selectedCat.hunger * 100)}%</span>
                    </div>
                    <Progress value={selectedCat.hunger}
                      color={getProgressColor(selectedCat.hunger)}
                      style={{
                        maxHeight: "10px"
                      }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <Footer>
          <Spacer />
          <button className="nes-btn" onClick={() => setModalOpen(false)}>关闭</button>
        </Footer>
      </Modal>
    </div>
  );
}

export function Android(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 5h2v2H2zm4 4H4V7h2zm2 0H6v2H4v2H2v6h20v-6h-2v-2h-2V9h2V7h2V5h-2v2h-2v2h-2V7H8zm0 0h8v2h2v2h2v4H4v-4h2v-2h2zm2 4H8v2h2zm4 0h2v2h-2z"
      ></path>
    </svg>
  )
}
