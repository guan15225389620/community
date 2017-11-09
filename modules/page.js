function getPages(currentPage, totalPage) {
    var pages = [currentPage]; // [3,4,5,6,7,8,9,10,11,12]
    var left = currentPage - 1; // 9,8,7,3
    var right = currentPage + 1; // 11,12,13
    while (pages.length < 10 && (left >= 1 || right <= totalPage)) {
        if (left >= 1) pages.unshift(left--);
        if (right <= totalPage) pages.push(right++);
    }
    return pages;
}

module.exports = {
    getPages
}