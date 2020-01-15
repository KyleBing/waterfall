let col = 5;          // 自定义列数
let gap = 5;          // 只本地测试时，单次添加的数量

let imgs = [];


let itemClassName = '.box';   // 卡片选择器名
let itemIdPref = 'box';       // 每个卡片id的前缀
let containerIdName = '.container'; // 容器选择器名

// 页面载入时刷新布局
$(window).on('load', function () {
    for(let i=0; i< 35; i++){
        imgs.push({
            id: i,
            url: `pics/${i+1}.jpg`
        })
    }
    addContent(imgs);
    waterFall();
});

// 滚动时
$(window).on('scroll', function () {
    let lastTop = $(itemClassName + ':last').offset().top;
    let scrollTop = $('body').scrollTop();
    let windowHeight = $(window).height();
    // console.log(lastTop, scrollTop, windowHeight);

    if (IsScroll()) {
        // 获取数据
        let data = []; // 测试数据，模拟网络获取的数据
        for(let i=0; i<gap; i++){
            let currentItem = imgs[Math.floor(Math.random() * imgs.length)];  // 测试用，添加数据
            currentItem.id = Math.floor(Math.random() * 1000000);
            data.push(currentItem);
        }
        imgs.concat(data);

        addContent(data); // 添加卡片到页面中
        waterFall();
    }
});


function addContent(data) {
    data.forEach(item => {
        var node = `<div id="${itemIdPref + item.id}" class="box">
                        <div class="pic">
                            <a href="${item.url}">
                                <img src="${item.url}" alt="${item.id}"/>
                            </a>
                        </div>
                    </div>`;

        $(containerIdName).append(node);
        $('#' + itemIdPref + item.id).css('opacity', 0) //在刚加载前设置要加载的node为透明
          .animate({opacity: 1}, 1000); // 加载后设置动画渐渐出现
    });
}


/**
 * 这个方法只负责处理卡片的排布，不处理加载数据
 * @constructor
 */
function waterFall() {
    let items = $(itemClassName);
    items.css('width', $(containerIdName).width() / col);
    // 给 item 添加宽度css 因为在 hot 中定义了padding-right:20px 来 抵消 box 中的 padding-left, hot 的 outerWidth 就是1420
    // 用百分比会使 box 的宽度变为 710px，导致错位

    let heightArray = [];
    items.each(function (index) {
        if (index < col) {
            heightArray.push(items.eq(index).outerHeight()); // 把最近一组的卡片高度放入数组
        } else {
            let boxWidth = items.eq(0).outerWidth();
            let minHeight = Math.min.apply(null, heightArray);
            let colIndex = $.inArray(minHeight, heightArray); // 得到最小值在数组中的序号
            items.eq(index).css({
                position: 'absolute',
                left: boxWidth  * colIndex + 'px',
                top: minHeight + 'px'
            });
            heightArray[colIndex] = minHeight + $(this).outerHeight();
        }
    });

    $(containerIdName).height(Math.max.apply(null, heightArray) + 50); //设置 .hot 为最后 box 高度 +50px
}

/**
 * 判断是否满足加载数据的条件
 * @return {boolean}
 * @constructor
 */
function IsScroll() {
    let lastItemOffsetTop = document.querySelector(itemClassName + ':last-child').offsetTop;
    let scrollTop = document.documentElement.scrollTop;
    let winHeight = window.innerHeight;
    return lastItemOffsetTop < (scrollTop + winHeight)
}