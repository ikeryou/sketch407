import { Color, DirectionalLight } from "three"
import { Canvas } from "../webgl/canvas"
import { Line } from "./line"
import { Param } from "../core/param"
import { Util } from "../libs/util"
import { Conf } from "../core/conf"
import { Update } from "../libs/update"
import { Func } from "../core/func"


export class Visual extends Canvas {

  private _line:Array<Line> = []
  private _lightA:DirectionalLight

  constructor(opt: any) {
    super(opt)

    this._lightA = new DirectionalLight(0xffffff, 2)
    this.mainScene.add(this._lightA)

    Param.instance.baseColor = new Color(Util.random(0,1), Util.random(0,1), Util.random(0,1))
    Param.instance.baseColorB = new Color(Util.random(0,1), Util.random(0,1), Util.random(0,1))

    for(let i = 0; i < Conf.instance.LINE_NUM; i++) {
      const l = new Line({
        id:i,
      })
      l.init()
      this._line.push(l)
      this.mainScene.add(l)
    }

    this._resize()
  }


  _update():void {
    this._lightA.position.x = Param.instance.light.x.value * 1
    this._lightA.position.y = Param.instance.light.y.value * 1
    this._lightA.position.z = Param.instance.light.z.value * 1

    if(Update.instance.cnt % 2 == 0) {
      Param.instance.baseColor = new Color(Util.random(0,1), Util.random(0,1), Util.random(0,1))
      Param.instance.baseColorB = new Color(Util.random(0,1), Util.random(0,1), Util.random(0,1))
    }

    if(this.isNowRenderFrame()) {
      this._render()
    }
  }


  _render():void {
    this.renderer.setClearColor(0x0000, 1)
    this.renderer.render(this.mainScene, this.cameraPers)
  }


  isNowRenderFrame():boolean {
    return (Update.instance.cnt % 1 == 0)
  }


  _resize():void {
    super._resize()

    const w = Func.sw()
    const h = Func.sh()

    this.renderSize.width = w
    this.renderSize.height = h

    this._updatePersCamera(this.cameraPers, w, h)

    let pixelRatio:number = window.devicePixelRatio || 1
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(w, h)
    this.renderer.clear()
  }
}