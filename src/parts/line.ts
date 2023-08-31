import { Object3D, Vector3 } from "three"
import { MyObject3D } from "../webgl/myObject3D"
import { Util } from "../libs/util"
import { Func } from "../core/func"
import { Conf } from "../core/conf"
import { Item } from "./item"

export class Line extends MyObject3D {

  public lineId:number = 0

  private _noise: Vector3 = new Vector3()
  private _con: Object3D
  private _items:Array<Item> = []


  constructor(opt:any = {}) {
    super()

    this.lineId = opt.id

    this._con = new Object3D()
    this.add(this._con)

    let num = Util.randomInt(4, 10)
    num = 30
    for(let i = 0; i < num; i++) {
      const item = new Item({
        lineId:this.lineId,
        id:i,
        color:opt.color
      })
      item.init()
      this._items.push(item)
      this._con.add(item)
    }

    this._eShowed()
    this._resize()
  }

  public setSize(_w:number, h:number):void {
    this._noise.x = Util.range(2)

    const h2 = h / this._items.length
    this._items.forEach((val,i) => {
      val.setSize(h2 * 0.2, h2 * 1)
      // val.position.z = h2 * i * 1
      val.position.y = h2 * i * 0.02
    })

    // this._con.position.y = -h * 0.5
  }


  public show(opt:any = {}):void {

    const sw = Func.sw()
    const sh = Func.sh()

    this.setSize(0, Util.random(sh * 0.25, sh * 1))
    // if(Util.hit(4)) {
    //   this.setSize(0, Util.random(sh * 2.5, sh * 3))
    // }

    const radius = sw * 0.05
    const radian = Util.radian((360 / Conf.instance.LINE_NUM * 1) * this.lineId)
    this.position.x = Math.sin(radian) * radius
    this.position.y = Math.cos(radian) * radius
    this.position.z = 0

    const radian2 = Math.atan2(this.position.x, this.position.y)
    this.rotation.z = radian2 * -1
    // this.rotation.y = radian2

    const s = Util.random(2, 6)
    this.scale.set(s, s, s)

    Util.shuffle(this._items)
    this._items.forEach((val,i) => {
      val.show({
        delay:opt.delay + i * 0.01,
        onComplete:(i == this._items.length - 1 ? () => {this._eShowed()} : null)
      })
    })
  }


  private _eShowed(_opt:any = {}):void {
    this.show({
      delay:0
    })
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    // this.rotation.x += 0.01
    // this.rotation.y += 0.01
    this.rotation.z += 0.005 * -1

    this.position.z += 2
  }
}