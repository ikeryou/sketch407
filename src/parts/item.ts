import { BoxGeometry, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Vector3 } from "three"
import { MyObject3D } from "../webgl/myObject3D"
import { Val } from "../libs/val"
import { Util } from "../libs/util"
import { Param } from "../core/param"
import { Tween } from "../core/tween"

export class Item extends MyObject3D {

  public itemId:number = 0

  private _conBlock:Object3D
  private _conLine:Object3D
  private _block:Mesh
  private _line:Mesh
  private _showRate:Val = new Val()
  private _showRate2:Val = new Val()
  private _noise:Vector3 = new Vector3()

  public blockSize:Vector3 = new Vector3()
  public lineSize:Vector3 = new Vector3()
  public size:Vector3 = new Vector3()


  constructor(opt:any = {}) {
    super()

    this.itemId = opt.id

    this._conLine = new Object3D()
    this.add(this._conLine)

    this._conBlock = new Object3D()
    this.add(this._conBlock)

    this._block = new Mesh(
      new BoxGeometry(1,1,1),
      new MeshPhongMaterial({
        color:0x000000,
        emissive:0x000000,
        specular:0xffffff,
        transparent:true,
        depthTest:false,
        wireframe:Util.hit(3)
      })
    )
    this._conBlock.add(this._block)
    this._block.position.x = 0.5
    this._block.position.y = 0.5
    this._block.renderOrder = 2

    this._line = new Mesh(
      new BoxGeometry(1,1,1),
      new MeshBasicMaterial({
        color:0x000000,
        wireframe:Util.hit(3)
      })
    )
    this._conLine.add(this._line)
    this._line.position.x = 0.5
    this._line.position.y = 0.5

    this._resize()
  }


  public setSize(w:number, h:number):void {
    let color = Param.instance.baseColor as Color
    if(Util.hit(4)) color = Param.instance.baseColorB

    let hsl = {h:0, s:0, l:0}
    color.getHSL(hsl)
    hsl.h += 0.01
    const colorA = new Color(0)
    colorA.setHSL(hsl.h, hsl.s, hsl.l)

    const colorB = new Color(1 - colorA.r, 1 - colorA.g, 1 - colorA.b)
    let hsl2 = {h:0, s:0, l:0}
    colorB.getHSL(hsl2)
    hsl2.l *= 0.1
    hsl2.s *= 0.1
    colorB.setHSL(hsl2.h, hsl2.s, hsl2.l)

    colorA.getHSL(hsl)
    hsl.s *= 1.5
    colorA.setHSL(hsl.h, hsl.s, hsl.l)

    ;(this._block.material as MeshPhongMaterial).color = colorA
    ;(this._block.material as MeshPhongMaterial).emissive = colorB
    ;(this._line.material as MeshBasicMaterial).color = colorA

    this._noise.x = Util.random(0.5, 1)
    this._noise.z = Util.random(1, 2)
    if(Util.hit(4)) {
      this._noise.z = Util.random(1, 2) * 0.1
    }
    this._noise.y = Util.range(2)
    if(Util.hit(10)) {
      this._noise.x = 5
    }
    this._noise.x = 0.5
    this._noise.y = 2

    // this._conBlock.scale.set(w, w, 1)
    this._conBlock.position.y = h * 1

    const lineW = Util.random(1, 1)
    // this._conLine.scale.set(lineW, h, lineW)

    this.blockSize.x = w * this._noise.x * 2 * this._noise.z * 1.5
    this.blockSize.y = this.blockSize.x * 0.1
    if(Util.hit(5)) {
        this.blockSize.x *= 1
    }

    this.lineSize.x = lineW * 0.5
    this.lineSize.y = h * 1

    this.size.x = w
    this.size.y = h
  }


  public show(opt:any = {}):void {
    const t = 1
    const e = Tween.ExpoEaseOut

    this.visible = false

    Tween.a(this._showRate2, {
      val:[0, 1]
    }, t, opt.delay, e)

    Tween.a(this._showRate, {
      val:[0, 1]
    }, t * 2, opt.delay + t, e, null, null, () => {
      if(opt.onComplete != undefined) opt.onComplete()
    })
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    this._block.rotation.x += 0.05

    this.visible = this._showRate2.val > 0.0001

    this._conBlock.scale.set(Util.mix(0.00001, this.blockSize.x, this._showRate.val), Util.mix(0.00001, this.blockSize.y, this._showRate.val), 0.001 + this._showRate.val * 3)
    this._conLine.scale.set(this.lineSize.x, Util.mix(0.000001, this.lineSize.y, this._showRate2.val), this.lineSize.x)

    this.rotation.z = Util.radian(Util.mix(0, 360 * this._noise.y, this._showRate.val))
  }

}