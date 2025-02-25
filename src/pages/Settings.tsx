import { Button, Container } from "nes-ui-react";
import "../App.css";

export default function Settings() {
  return (
    <div className="flex gap-1 items-center justify-center flex-col w-full max-w-md">
      <h2 className="text-2xl">设置</h2>
      <Container title="" className="w-full">
        <span>嗯，也许这里可以放点用户头像什么的～</span>
      </Container>
      <Container title="关联账户" className="w-full">
        <div className="flex items-center">
          <span className="text-base flex-1 overflow-hidden text-ellipsis">Gradescope: 未关联</span>
          <Button className="text-sm scale-90" borderInverted>登录</Button>
        </div>
        <br />
        <div className="flex items-center">
          <span className="text-base flex-1 overflow-hidden text-ellipsis">Blackboard: 未关联</span>
          <Button className="text-sm scale-90" borderInverted>登录</Button>
        </div>
        <br />
        <div className="flex items-center">
          <span className="text-base flex-1 overflow-hidden text-ellipsis">ACM OJ: 未关联</span>
          <Button className="text-sm scale-90" borderInverted>登录</Button>
        </div>
      </Container>
    </div>
  )
}