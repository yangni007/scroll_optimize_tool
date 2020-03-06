/**
 * 列表当前条永远在当前可视窗口
 * 传入参数：
 * scrollData： {
 * activeIndex: 0, // 当前条的下标
    total: 0, // 总条数
    el: null, // 滚动容器
    list_height: 0 // 每一条的高度
 * keyDownCallback，按向下键的回调函数
 * keyUpCallback，按向上键的回调函数
 * 
 * 传递一个对象参数的好处是：在类外修改activeIndex，类内部能动态跟着变化；反之，类内部改变了activeIndex, 外部也能跟着改变。
 * 
 * 最后不要忘记销毁监听器，调用removeListener
 */
class ScrollActiveListVisibility {
    UP_KEY_CODE = [37, 38]; // 37向左键， 38是向上键
    DOWN_KEY_CODE = [39, 40]; // 39向右键， 40是向下键
    scrollData = {
        activeIndex: 0,
        total: 0,
        el: null,
        list_height: 0
    }
    constructor(scrollData, keyDownCallback, keyUpCallback) {
        this.scrollData = scrollData;
        this.keyDownCallback = keyDownCallback;
        this.keyUpCallback = keyUpCallback;
        this.addListener();
    }

    addListener() {
        document.addEventListener('keydown', this.keyDown)
    }
    removeListener() {
        document.removeEventListener('keydown', this.keyDown)
    }
    keyDown = (e) => {
        if(this.DOWN_KEY_CODE.includes(e.keyCode)) { // 向下键
            // 阻止向下键的默认行为，自动滚动滚动条
            e.preventDefault();
            if(this.scrollData.activeIndex < this.scrollData.total - 1) {
                this.scrollData.activeIndex++;
                this.scrollTo();
                this.keyDownCallback && this.keyDownCallback();
            }
        } else if(this.UP_KEY_CODE.includes(e.keyCode)) { // 向上键
            e.preventDefault();
            if(this.scrollData.activeIndex > 0) {
                this.scrollData.activeIndex--;
                this.scrollTo();
                this.keyUpCallback && this.keyUpCallback();
            }
        }
    }
    scrollTo() {
        if(this.scrollData.el) {
            let el_scrollTop = this.scrollData.el.scrollTop,
            el_height = this.scrollData.el.clientHeight;
            // 当前条，隐藏在滚动条的顶部：当前条的上边框高度 与 滚动条的高度相比
            if(el_scrollTop > this.scrollData.activeIndex * this.scrollData.list_height) {
                // 滚动到当前条的上边框
                this.scrollData.el.scrollTo(0, this.scrollData.activeIndex * this.scrollData.list_height);
            // 当前条在滚动条的底部：当前条下边框高度 与 滚动条的高度+可视区域的高 相比
            } else if(el_scrollTop  + el_height < (this.scrollData.activeIndex + 1) * this.scrollData.list_height) {
                // 滚动到当前条的下边框
                this.scrollData.el.scrollTo(0, (this.scrollData.activeIndex + 1) * this.scrollData.list_height - el_height);
            } 
        }
        
    }
}