
import { _decorator, Component, Node, RigidBody, Vec3, Collider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    private initSpeed = 0;

    onLoad(){
        let collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter',this.onCollisionEnter,this)
    }
    onCollisionEnter(){
        console.log("碰撞回調")
        //反彈
        this.bounce()
    }
    //碰撞處理
    bounce(){
        let rigidBody = this.getComponent(RigidBody);
        if(rigidBody){
            if(!this.initSpeed){
                let vc = new Vec3(0,0,0);
                rigidBody.getLinearVelocity(vc);
                this.initSpeed = vc.y
            }else{
                rigidBody.setLinearVelocity(new Vec3(0,this.initSpeed,0))
            }
        }
    }
    boost(){
         //點擊小球產生向下的加速度
        //1.拿到剛體組件
        let rigidBody = this.node.getComponent(RigidBody);
        //2.設置向下速度
        if(rigidBody){
            rigidBody.setLinearVelocity(new Vec3(0,-4,0))
        }
        //3.這裡會越彈越高，所以需要保存第一次彈跳的高度

    }
  
    
}

