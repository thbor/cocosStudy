
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    //對外暴露接口
    init(width:number,y_offset:number = 0){
        let scale = this.node.getScale();
        this.node.setScale(scale);

        let pos = this.node.position;
        this.node.setPosition(pos.x,y_offset,pos.z)
    }
}

