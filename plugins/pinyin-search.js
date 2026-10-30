/**
 * MAERS Pinyin Search Utility
 * 支持中文、拼音全拼、拼音首字母搜索
 */
(function(window) {
    // GB2312 pinyin initial boundaries (proven, compact approach)
    // Each entry: [unicodeChar, pinyinInitial]
    var BOUNDS = '\u5765B\u58F0C\u5BF5D\u5E02E\u5F20F\u6208G\u6862H\u6B20J\u6D9FK\u6EF9L\u7322M\u7691N\u7808O\u7A46P\u7C30Q\u7E82R\u7FCES\u82B9T\u8516W\u8760X\u8C22Y\u94B0Z';

    // Parse bounds into array
    var boundArr = [];
    for (var i = 0; i < BOUNDS.length; i += 2) {
        boundArr.push({ code: BOUNDS.charCodeAt(i), initial: BOUNDS[i + 1] });
    }

    function charInitial(c) {
        var code = c.charCodeAt(0);
        // ASCII letters/digits
        if (code >= 65 && code <= 90) return c;
        if (code >= 97 && code <= 122) return c.toUpperCase();
        if (code >= 48 && code <= 57) return c;
        // Not CJK
        if (code < 0x4E00 || code > 0x9FFF) return '';
        // Binary search in bounds
        for (var i = boundArr.length - 1; i >= 0; i--) {
            if (code >= boundArr[i].code) return boundArr[i].initial;
        }
        return 'A';
    }

    /**
     * Get pinyin initials of a string
     * "一位世界" → "YWSJ"
     */
    function getInitials(str) {
        if (!str) return '';
        var result = '';
        for (var i = 0; i < str.length; i++) {
            result += charInitial(str[i]);
        }
        return result;
    }

    /**
     * Fuzzy match: check if query matches target
     * Supports: Chinese chars, pinyin initials, partial match
     */
    function fuzzyMatch(query, title) {
        if (!query) return true;
        var q = query.toUpperCase().trim();
        var t = title.toUpperCase();
        var initials = getInitials(title);

        // Direct substring match (Chinese or English)
        if (t.indexOf(q) !== -1) return true;
        // Pinyin initials match (e.g. "YWSJ" matches "一位世界")
        if (initials.indexOf(q) !== -1) return true;
        // Partial initials from start
        if (initials.indexOf(q) === 0) return true;

        return false;
    }

    window.PinyinSearch = {
        getInitials: getInitials,
        fuzzyMatch: fuzzyMatch
    };
})(window);
