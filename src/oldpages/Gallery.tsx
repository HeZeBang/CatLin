// import { A, Badge, BadgeSplitted, Button, Checkbox, IconButton, Input, Radio } from "nes-ui-react";
import { PixelBorder, Progress, Modal, Header, Footer, Spacer, Input } from "nes-ui-react";
import { SVGProps, useEffect, useState } from "react";
import { ICat } from "@/models/cat";
import { dummyCats } from "@/data/cats";

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
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

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

  const handleRename = async () => {
    if (!selectedCat || !newName.trim()) return;
    
    try {
      const response = await fetch('/api/cat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: dummyCats.findIndex(cat => cat.avatar === selectedCat.avatar),
          name: newName.trim()
        }),
      });

      if (!response.ok) throw new Error('Failed to rename cat');

      const updatedCat = await response.json();
      
      // Update local state
      setCats(cats.map(cat => 
        cat.avatar === selectedCat.avatar 
          ? { ...cat, name: updatedCat.name }
          : cat
      ));
      setSelectedCat({ ...selectedCat, name: updatedCat.name });
      setIsRenaming(false);
      setNewName("");
    } catch (error) {
      console.error('Error renaming cat:', error);
    }
  };

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
                {/* {displayCat.description && <span className="text-base opacity-80">{displayCat.description}</span>} */}
                {displayCat.owned && (
                  <>
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
                  </>
                )}
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
                  {isRenaming ? (
                    <div className="flex gap-2 items-center flex-1">
                      <Input
                        type="text"
                        value={newName}
                        onChange={(value) => setNewName(value)}
                        className="flex-1"
                      />
                      <button className="nes-btn is-success" onClick={handleRename}>确认</button>
                      <button className="nes-btn is-error" onClick={() => {
                        setIsRenaming(false);
                        setNewName("");
                      }}>取消</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-bold">{selectedCat.name}</span>
                      <div className="flex gap-2">
                        {selectedCat.owned && (
                          <button className="nes-btn" onClick={() => {
                            setIsRenaming(true);
                            setNewName(selectedCat.name);
                          }}>改名</button>
                        )}
                        <span className={`nes-badge ${selectedCat.owned ? "is-primary" : "is-error"}`}>
                          <span>{selectedCat.owned ? "已获得" : "未获得"}</span>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {selectedCat.description && (
                  <p className="text-base opacity-80">{selectedCat.description}</p>
                )}
                {selectedCat.owned && (
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
                )}
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