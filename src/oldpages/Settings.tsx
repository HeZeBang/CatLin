import { Button, Container, Footer, Header, Input, Modal, Spacer } from "nes-ui-react";
import "../App.css";
import { useCallback, useState, useContext } from "react";
import { AccountType, LoadUsername, LoginAndSave, SaveHomework } from "../components/Utils";
import { UserContext } from "../App";
import { UserContextType } from "../models/context";
import { availableBadges } from "../models/badges";
import { LoginButton } from "../components/LoginButton";
import { AuthComponent } from "@/components/Auth";
import { signOut } from "next-auth/react";

export default function Settings() {
  const [modalType, setModalType] = useState<AccountType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalBadgeOpen, setModalBadgeOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { userId, userName, user, handleLogout } = useContext<UserContextType>(UserContext);

  const Login = useCallback(async () => {
    setIsLoggingIn(true)
    setErrMsg("")
    try {
      const LoginPromise = LoginAndSave(modalType, username, password)
      if (LoginPromise instanceof Error) {
        throw LoginPromise
      }
      const data = await LoginPromise
      if (data instanceof Error) {
        throw data
      }
      if (modalType === null) {
        throw Error("Empty Account Type")
      }
      SaveHomework(modalType, data)
      setModalOpen(false)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        setErrMsg(error.message)
      } else {
        setErrMsg(`An unknown error occurred: ${JSON.stringify(error)}`)
      }
    } finally {
      setIsLoggingIn(false)
    }
  }, [modalType, username, password])

  const ChangeBadge = useCallback(async () => {
    setModalBadgeOpen(false)
  }, [])

  return (
    <div className="flex gap-1 items-center justify-center flex-col w-full max-w-md">
      <h2 className="text-2xl">设置</h2>
      {userId ? (
        <Container title="" className="w-full">
          <div className="flex flex-col gap-3 items-start justify-stretch w-full">
            <div className="flex gap-3">
              <i className="nes-icon github scale-[2] mr-10 mb-10" />
              <div className="flex flex-col flex-grow">
                <div className="flex gap-1">
                  <span className="text-2xl">{userName}</span>
                </div>
                <span>Lv.{user?.level}, EXP.{user?.exp}</span>
              </div>
            </div>
            <div className="flex gap-3 items-center w-full">
              <div className="nes-badge top-0.5 min-w-fit w-full">
                <span className={`${availableBadges.at(user?.current_badge || 0)?.color} min-w-fit`}>
                  {availableBadges.at(user?.current_badge || 0)?.name}
                </span>
              </div>
              <Button onClick={() => setModalBadgeOpen(true)} className="min-w-fit">更换</Button>
              <Modal open={modalBadgeOpen} title="更换徽章" className="max-w-sm">
                <Header>
                  <span className="text-lg">更换徽章</span>
                </Header>
                <div className="flex flex-col gap-1 p-3">
                  {
                    availableBadges.map((badge, index) => (
                      <div key={index} className={`flex flex-col items-center p-2 ${user?.badges?.includes(index) ?
                        "hover:backdrop-brightness-75 active:scale-90" : "opacity-50"
                        }`}>
                        <div className="nes-badge w-2/3">
                          <span className={`${availableBadges.at(index)?.color}`}>
                            {availableBadges.at(index)?.name}
                          </span>
                        </div>
                        <span className="text-sm">{availableBadges.at(index)?.description}</span>
                        {/* <Button className="text-sm scale-90 mt-1" borderInverted
                              onClick={() => {
                                if (user) {
                                  // user.current_badge = badge
                                  // user.save() // TODO: save
                                }
                              }}
                            >
                              选择
                            </Button> */}
                      </div>
                    ))
                  }
                  <span>共 {user?.badges?.length || 0} 个徽章</span>
                </div>
                <Footer>
                  <Spacer />
                  <Button color="white" className="mx-1" onClick={() => setModalBadgeOpen(false)}>取消</Button>
                  <Button color="primary" className="mx-1" onClick={ChangeBadge}>更换</Button>
                </Footer>
              </Modal>
            </div>

            {/* <div className="flex gap-1 flex-col">
              <span className="text-md">距离下个等级还需 {1000} 经验值</span>
              <div className="text-md flex justify-center items-center">
                <span className="flex-auto min-w-[4em] text-nowrap">成就收集</span>
                <Progress value={0.1}
                  style={{
                    maxHeight: "10px"
                  }} />
              </div>
              <div className="text-md flex justify-center items-center">
                <span className="flex-auto min-w-[4em] text-nowrap">完成速度</span>
                <Progress value={0.5}
                  style={{
                    maxHeight: "10px"
                  }} />
              </div>
              <div className="text-md flex justify-center items-center">
                <span className="flex-auto min-w-[4em] text-nowrap">完成质量</span>
                <Progress value={0.8}
                  style={{
                    maxHeight: "10px"
                  }} />
              </div>
            </div> */}

            <Button className="w-full" color="error" borderInverted
              onClick={async () => {
                // await signOut()
                handleLogout()
                // googleLogout()
                // location.reload()
              }}
            >
              登出
            </Button>
          </div>
        </Container>
      ) : (
        <Container title="登录" className="w-full">
          <AuthComponent />
        </Container>
      )}
      <Container title="关联账户" className="w-full">
        {Object.values(AccountType).filter(item => item !== AccountType.Custom).map((item) => (
          <div className="flex items-center" key={item}>
            <span className="text-base flex-1 overflow-hidden text-ellipsis">{item}: {LoadUsername(item) || '未绑定'}</span>
            <Button className="text-sm scale-90" borderInverted
              onClick={() => {
                setModalType(item)
                setErrMsg("")
                setUsername("")
                setPassword("")
                setModalOpen(true)
              }}
            >
              {LoadUsername(item) ? '重新登录' : '登录'}
            </Button>
          </div>
        ))}
      </Container>
      <Container title="缓存" className="w-full">
        <div className="flex flex-col gap-1">
          <Button color="error" className="w-fit"
            onClick={() => { localStorage.clear(); location.reload() }}>清除缓存</Button>
          <span className="text-red-500">清除缓存将清除所有的登录和作业数据。</span>
        </div>
      </Container>
      <Modal open={modalOpen} title="登录账户" className="max-w-sm">
        <Header>
          <span className="text-lg">登录 {modalType}</span>
        </Header>
        <div className="px-3">
          <Input type="text"
            className="text-md bg-inherit"
            label="账号" value={username}
            onChange={(e) => setUsername(e)}
          // onKeyUp={(e) => e.key === "Enter" && Login()}
          />
          <Input type="password"
            className="text-md bg-inherit"
            label="密码" value={password}
            onChange={(e) => setPassword(e)}
            onKeyUp={(e) => e.key === "Enter" && Login()}
          />
          {/* {isLoggingIn && <Hourglass className="mx-auto animate-pulse h-5 w-5" />} */}
          {isLoggingIn &&
            <img
              src={`/public/cats/${["white", "blue", "gray"].at(Math.random() * 100 % 3)}_loading.gif`}
              alt="loading"
              className="mx-auto w-2/3"
              style={{
                imageRendering: "pixelated"
              }}
            />}
          {errMsg && <span className="text-red-500">{errMsg}</span>}
        </div>
        <Footer>
          <Spacer />
          <Button color="white" className="mx-1" onClick={() => setModalOpen(false)}>取消</Button>
          <Button color="primary" className="mx-1" disabled={isLoggingIn} onClick={Login}>登录</Button>
        </Footer>
      </Modal>
    </div>
  )
}