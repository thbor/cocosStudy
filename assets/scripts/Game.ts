
import { _decorator, Component, Node,systemEvent, RigidBody, Vec3, Prefab, instantiate, game, Director, Label, Camera, SystemEventType, EventKeyboard, macro } from 'cc';
import {Ball} from "./Ball"
import {Block} from "./Block"
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    private BallNode:Node = null!;
    @property(Prefab)
    private BlockPrefeb:Prefab = null!;
    @property(Label)
    private scoreLabel:Label = null!;
    @property(Camera)
    private Camera_1:Camera = null!;
    @property(Camera)
    private Camera_2:Camera = null!;

    private BlockNodeArr:Node[] = []
    
    private gameState:number = 0;   //0：未開局  1：遊戲開始  2：遊戲結束

    private LastBlockNode:Node = null!  //當前場景中最後一塊跳板

    private score:number = 0;   //初始得分
    onLoad(){
        //點擊開始的時候
        systemEvent.on(Node.EventType.TOUCH_START,this.touchStart,this)
        //按下空格切換視角
        systemEvent.on(SystemEventType.KEY_DOWN,this.keyDown,this)
        this.initBlock()
    }
    // dt:兩楨之間的間距
    update(dt:number){
        if(this.gameState===1){
            if(this.BallNode.getPosition().y<-4){
                console.log("遊戲結束")
                Director.instance.loadScene("Game")
                return
            }
            console.log("遊戲開始，木板開始移動")
            // 遊戲開始，木板開始移動
            let speed = (-2)*dt;
            for(let blockNode of this.BlockNodeArr){
                let nowPosition = blockNode.getPosition();
                let nextX = nowPosition.x+speed;
                //跳板飛到屏幕之外去了，進行循環滾動
                if(nextX<=-2){
                    this.incrScore(1)
                    blockNode.setPosition(this.LastBlockNode.getPosition().x+2,nowPosition.y,nowPosition.z)
                    this.LastBlockNode = blockNode;

                    let block = blockNode.getComponent("Block") as Block;
                    block.init(0.5+0.6+Math.random(),(Math.random()>0.5?1:-1)*(Math.random()*0.6))
                }else{
                    console.log("nextX",nextX)
                    blockNode.setPosition(nextX,nowPosition.y,nowPosition.z)
                }
            }
        }
    }
    touchStart(){
        let ball = this.BallNode.getComponent("Ball") as Ball;
        //小球加速邏輯
        ball.boost()
        //第一次點擊屏幕才開始遊戲
        if(this.gameState === 0){
            this.gameState = 1
        }
    }
    //鍵盤事件監聽
    keyDown(e:EventKeyboard){
        console.log(e.keyCode)
        switch(e.keyCode){
            //按下空格時
            case macro.KEY.space:{
                this.switchCamera()
                break;
            }
        }
    }
    //切換攝像機
    switchCamera(){
        //1號攝像機被激活時
        if(this.Camera_1.node.active){
            this.Camera_1.node.active = false;
            this.Camera_2.node.active = true;
        }else{
            this.Camera_1.node.active = true;
            this.Camera_2.node.active = false;
        }
    }
    //初始化跳板
    initBlock(){
        for(let i=0;i<4;i++){
            //將BlockPrefeb變成節點
            let blockNode = instantiate(this.BlockPrefeb);
            this.node.addChild(blockNode)
            this.BlockNodeArr.push(blockNode)
            //設置位置
            blockNode.setPosition(new Vec3(i*(2),0,0))
        }
        this.LastBlockNode =  this.BlockNodeArr[this.BlockNodeArr.length-1]
    }
    //得分增加
    incrScore(inrc:number){
        this.score += inrc;
        this.scoreLabel.string = String(this.score)
    }
}


