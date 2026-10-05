export default {
    drag() {
        const popups = document.querySelectorAll('.mapboxgl-popup-content')
        popups.forEach(popup => {
            popup.addEventListener('mousedown', (e) => {
                e.preventDefault()
                e.stopPropagation()
                const {
                    clientX,
                    clientY
                } = e
                const {
                    offsetLeft,
                    offsetTop
                } = popup
                const disX = clientX - offsetLeft
                const disY = clientY - offsetTop
                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', up)

                function move(e) {
                    const {
                        clientX,
                        clientY
                    } = e
                    popup.style.left = clientX - disX + 'px'
                    popup.style.top = clientY - disY + 'px'
                }

                function up() {
                    document.removeEventListener('mousemove', move)
                    document.removeEventListener('mouseup', up)
                }
            })
        })
    },
    slide() {
        // 添加滑动条
        const slider = document.getElementById('slider');

        slider.addEventListener('input', function(e) {
        const pitchValue = parseInt(e.target.value);

        // 更新地图的倾斜角度
         this.map.setPitch(pitchValue);
        });
    }
}
