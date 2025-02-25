import { Button, Container, Footer, Header, Input, Modal, Spacer } from "nes-ui-react";
import "../App.css";
import { useCallback, useState } from "react";
import { AccountType, LoginAndSave, SaveHomework } from "../components/Utils";
import { Hourglass } from "../components/Icons";

export default function Settings() {
  const [modalType, setModalType] = useState<AccountType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

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
      <Container title="" className="w-full">
        <span>嗯，也许这里可以放点用户头像什么的～</span>
      </Container>
      <Container title="关联账户" className="w-full">
        <div className="flex items-center">
          <span className="text-base flex-1 overflow-hidden text-ellipsis">Gradescope: 未关联</span>
          <Button className="text-sm scale-90" borderInverted
            onClick={() => {
              setModalType(AccountType.Gradescope)
              setModalOpen(true)
            }}
          >
            登录
          </Button>
        </div>
        <br />
        <div className="flex items-center">
          <span className="text-base flex-1 overflow-hidden text-ellipsis">Blackboard: 未关联</span>
          <Button className="text-sm scale-90" borderInverted
            onClick={() => {
              setModalType(AccountType.Blackboard)
              setModalOpen(true)
            }}
          >
            登录
          </Button>
        </div>
        <br />
        <div className="flex items-center">
          <span className="text-base flex-1 overflow-hidden text-ellipsis">ACM OJ: 未关联</span>
          <Button className="text-sm scale-90" borderInverted
            onClick={() => {
              setModalType(AccountType.ACM_OJ)
              setModalOpen(true)
            }}
          >
            登录
          </Button>
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
          {isLoggingIn && <Hourglass className="mx-auto animate-pulse h-5 w-5" />}
          {errMsg && <span className="text-red-500">{errMsg}</span>}
        </div>
        <Footer>
          <Spacer />
          <Button color="white" className="mx-1" onClick={() => setModalOpen(false)}>取消</Button>
          <Button color="primary" className="mx-1" onClick={Login}>登录</Button>
        </Footer>
      </Modal>
    </div>
  )
}