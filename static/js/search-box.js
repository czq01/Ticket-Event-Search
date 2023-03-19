
// Auto-detect location
document.querySelector(".auto-detect").addEventListener(
    'change', function () {
        if(this.checked) {
            document.querySelector('input.Location')
                .setAttribute('style', 'display: none;')
        } else {
            document.querySelector('input.Location')
                .removeAttribute('style')
        }
    }
)

// Clear Button
const clear = document.querySelector('button.clear');
clear.addEventListener('click', function() {
    clear_result();
    document.querySelectorAll('.input-field>input').forEach(function (ele) {
        ele.value = '';
        if (document.querySelector('input.auto-detect').checked
        && ele.classList.contains('Location')) {}
        else {ele.removeAttribute('style');}

        document.querySelector('select').value = "Default";
    })
    document.querySelectorAll('.tip-text').forEach(
        function (ele) {ele.setAttribute('style', 'display:none');}
    )
})


// Arrow Button
arrow.addEventListener('click', function () {
    venue_card.removeAttribute('style');
    arrow.setAttribute('style', 'display: none');
    venue_card.scrollIntoView({'behavior': 'smooth', 'block': 'start'});
}, false);
