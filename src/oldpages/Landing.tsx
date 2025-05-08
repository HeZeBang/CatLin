import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AssignmentItem, HwItem } from "../components/HomeworkUtils";
import { AccountType, LoadAccount, LoadHomework, LoadUsername, LoginAndSave, SaveHomework } from "../components/Utils";
import { Link } from "react-router";
import { Button, IconButton } from "nes-ui-react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useLoading } from "../context/LoadingContext";
import { toast } from "sonner";
import { CloudDownload } from "@/components/Icons";
import { UserContext } from "@/App";
import confetti from "canvas-confetti";
import { ICatDocument } from "@/models/cat";

export default function Landing() {
  const [homeworks, setHomeworks] = useState<AssignmentItem[]>([])
  const [firstUse, setFirstUse] = useState(true)
  const [dueSplit, setDueSplit] = useState(0);
  const [drawerTop, setDrawerTop] = useState("100vh")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cats, setCats] = useState<ICatDocument[]>([])

  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { setIsLoading } = useLoading()

  const getCatTaskState = (catType: number) => {
    // Find all homeworks assigned to this cat type
    const catHomeworks = homeworks.filter(hw => hw.cat_type === catType);
    // If any homework has finished_task > 0 (has unclaimed reward), return 1
    return catHomeworks.some(hw => hw.finished_task && hw.finished_task > 0) ? 1 : 0;
  };

  const { unityProvider, isLoaded, unload, sendMessage } = useUnityContext({
    loaderUrl: "unity/demo/demo.loader.js",
    dataUrl: "unity/demo/demo.data.br",
    frameworkUrl: "unity/demo/demo.framework.js.br",
    codeUrl: "unity/demo/demo.wasm.br",
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('/api/cat');
        if (!response.ok) throw new Error('Failed to fetch cats');
        const data = await response.json();
        setCats(data);
      } catch (error) {
        console.error('Error fetching cats:', error);
      }
    };

    fetchCats();
  }, []);

  useEffect(() => {
    if (!isLoaded)
      return
    const data = {
      n: cats.length,
      ids: cats.map(cat => cat._id),
      xs: cats.map(cat => cat.x),
      ys: cats.map(cat => cat.y),
      types: cats.map(cat => cat.type),
      taskstates: cats.map(cat => getCatTaskState(cat.type)),
    }
    console.log("Sending cat data:", data)
    sendMessage("GameManager", "LoadCatDataFromServer", JSON.stringify(data))
    // sendMessage("GameManager", "LoadCatDataFromServer", "")
  }, [sendMessage, isLoaded, cats, homeworks])

  const showFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    if (isLoaded) {
      console.log("Unity loaded")
      // setDrawerOpen(true)
      toast.success("Unity loaded")
    }
    setIsLoading(!isLoaded)
  }, [isLoaded])

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  useEffect(() => {
    var hwTemp = [] as AssignmentItem[]
    Object.values(AccountType).forEach((type) => {
      if (LoadUsername(type)) setFirstUse(false)
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => b.due - a.due)
    setHomeworks(hwTemp)
    setDueSplit(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }, [])

  const SendTest = useCallback(() => {
    if (!isLoaded)
      return
    sendMessage("GameManager", "LoadCatDataFromServer", JSON.stringify({
      n: 3,
      ids: [1001, 1002, 1003],
      xs: ["1.5", "3.0", "3.2"],
      ys: ["2.3", "4.1", "3.4"],
      types: [0, 1, 0],
      taskstates: [2, 2, 2],
    }))
    // sendMessage("GameManager", "LoadCatDataFromServer", "")
  }, [sendMessage, isLoaded])

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [dueSplit])

  return (
    <>
      <Unity unityProvider={unityProvider} className='fixed w-full h-full m-0 top-0 left-0 z-0' />
      <IconButton className="fixed left-5 bottom-5 z-20" onClick={() => {
        (async () => {
          const allHomework: AssignmentItem[] = [];
          for (const type of Object.values(AccountType)) {
            const { username, password } = LoadAccount(type) || {};
            if (username) { // FIXME: replace with real password
              try {
                // @ts-ignore
                const result = await LoginAndSave(type, username, password);
                if (result instanceof Error) {
                  toast.error("Error logging in: " + result.message);
                  continue;
                }
                const data = result as any[];
                const oldHw = LoadHomework(type);
                const newHw = [...oldHw];
                toast.success("Sync finished: " + type);
                data.forEach(item => {
                  const index = oldHw.findIndex(hw => hw.course === item.course && hw.title === item.title);
                  const isNew = index === -1;
                  if (isNew) {
                    newHw.push(item);
                  } else {
                    // Already exists in the list
                    const isDiff = oldHw[index].submitted !== item.submitted;
                    const isTracing = !!oldHw[index].id;
                    if (isDiff) {
                      newHw[index] = {
                        ...oldHw[index],
                        ...item,
                        ...(item.submitted ? { finished_task: 10 } : {}), // TODO: custom gift
                      };
                      if (item.submitted) {
                        toast.success(`作业 ${item.title} 已完成`);
                      }
                    }
                  }
                });
                SaveHomework(type, newHw);
                allHomework.push(...newHw);
              } catch (error) {
                toast.error("An error occurred: " + error.message);
              }
            }
          }
          setHomeworks(allHomework.sort((a, b) => b.due - a.due));
          if (allHomework.every(hw => hw.submitted)) {
            showFireworks();
          }
          const audio = new Audio('/sound/applepay.mp3');
          audio.play();
          setIsLoading(false);
        })();
      }}>
        <CloudDownload />
        <span className="transition-all w-8 text-nowrap overflow-clip">同步</span>
      </IconButton>
      <IconButton className="fixed left-5 bottom-20 z-20" onClick={() => {
        toast.success("测试烟花效果");
        showFireworks();
      }}>
        <span className="text-2xl">🎆</span>
        <span className="transition-all w-8 text-nowrap overflow-clip">测试烟花</span>
      </IconButton>
      <IconButton className="fixed left-5 bottom-35 z-20" onClick={SendTest}>
        <span className="transition-all w-8 text-nowrap overflow-clip">测试通信</span>
      </IconButton>
      <div className="w-full h-auto overflow-scroll drawer flex items-center justify-start flex-col z-10 px-5"
        style={{
          marginTop: drawerOpen ? "calc(-9em + 100vh)" : "",
          minHeight: "100vh",
          transition: "margin-top 1s cubic-bezier(0.3, 0, 0.5, 1)",
        }}
      >
        <div className="nes-ui-toolbar -mx-5 w-full mb-5 mt-2"
          style={{
            minHeight: "2em",
          }}
          onClick={() => isLoaded && setDrawerOpen(!drawerOpen)}
        >
          <span className="text-xl justify-center w-full">
            {isLoaded ? (drawerOpen ? "返回作业列表" : "前往猫窝") : "猫窝加载中..."}
          </span>
        </div>
        <div ref={topRef} />
        <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
          {firstUse ? (
            <div className="flex flex-col gap-3 mt-5 items-center justify-center">
              <h1 className="text-5xl sm:text-6xl flex">=<span className="animate-bounce">^</span>·.·<span className="animate-bounce">^</span>=</h1>
              <span className="text-2xl">欢迎来到 CatLin ！</span>
              <span className="text-base mb-5">完成作业也可如此有趣！</span>
              <span className="text-base">
                快到
                {' '}
                <Link to="/settings" className="text-blue-500 animate-pulse">设置页</Link>
                {' '}
                关联作业账户吧！</span>
            </div>
          ) : (
            <>
              {homeworks
                .filter(item => item.due >= dueSplit)
                .filter(item => !item.submitted)
                .length == 0 && (
                  <div className="flex flex-col gap-5 mt-5 items-center justify-center">
                    <h1 className="text-4xl sm:text-6xl flex"><span className="animate-bounce">¯\_</span>(ツ)<span className="animate-bounce">_/¯</span></h1>
                    <span className="text-base sm:text-xl">你似乎已经把作业全写完了呢！</span>
                  </div>
                )}
              {(
                homeworks
                  .filter(item => item.due >= dueSplit)
                  // .filter(item => !item.submitted)
                  .map((hw, index) => (
                    <HwItem
                      key={`${hw.course}-s${hw.title}`}
                      course={hw.course}
                      title={hw.title}
                      submitted={hw.submitted}
                      due={hw.due}
                      url={hw.url}
                      index={index}
                      linked={!!hw.parent}
                      indicated={!!hw.finished_task}
                    />
                  ))
              )}
              <div className="flex gap-3 items-center justify-center">
                <Button
                  onClick={() => { setDueSplit(due => due - 7 * 24 * 60 * 60 * 1000) }}
                  className="text-nowrap"
                >
                  ▼ 显示更早
                </Button>
                <span>截至 {new Date(dueSplit).toLocaleString()}</span>
                <Button
                  onClick={() => { setDueSplit(due => Math.min(Date.now(), due + 7 * 24 * 60 * 60 * 1000)) }}
                  className="text-nowrap"
                >
                  显示更晚 ▲
                </Button>
              </div>
              <div ref={bottomRef} />
            </>
          )}
        </div>
      </div>
    </>
  )
}