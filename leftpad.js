function leftPad(str, len, char) {
    str = String(str)
    char = char?String(char) : " "

    while(str.length < len){
        str = char + str
    }
    return str
}

