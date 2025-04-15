import { Button, Container, Footer, Header, Input, Modal, Progress, Spacer } from "nes-ui-react";
import "../App.css";
import { useCallback, useState, useContext } from "react";
import { AccountType, LoadUsername, LoginAndSave, SaveHomework } from "../components/Utils";
import { UserContext } from "../App";
import { UserContextType } from "../lib/models/context";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

export default function Settings() {
  const [modalType, setModalType] = useState<AccountType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { userId, userName, handleLogin, handleLogout } = useContext<UserContextType>(UserContext);

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

  return (
    <div className="flex gap-1 items-center justify-center flex-col w-full max-w-md">
      <h2 className="text-2xl">设置</h2>
      {userId ? (
        <Container title="" className="w-full">
          <div className="flex-col items-center w-full">
            <div className="flex gap-3">
              <i className="nes-icon github scale-[6] mr-20 mb-20"
              />
              <div className="flex flex-col gap-3">
                <div className="flex gap-1">
                  <span className="text-2xl">{userName}</span>
                  <span>Lv.1</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="nes-badge">
                    <span className="is-success">新人出道</span>
                  </div>
                  {/* <span>共 1 个徽章</span> */}
                </div>
              </div>
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

            <Button className="w-full mt-3" color="error" borderInverted
              onClick={() => {
                handleLogout()
                googleLogout()
              }}
            >
              登出
            </Button>
          </div>
        </Container>
      ) : (
        <Container title="登录" className="w-full">
          <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Error while loggingin.")} />
        </Container>
      )}
      <Container title="关联账户" className="w-full">
        {Object.values(AccountType).map((item) => (
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