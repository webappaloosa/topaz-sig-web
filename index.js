//SigWebTablet JavaScript File for SigWeb
//
//Version - 1.0.0.1
//
//Last updated by Topaz Systems Inc. - 7/23/2019
//

var getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) || (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) || window.createObjectURL;

var revokeBlobURL = (window.URL && URL.revokeObjectURL.bind(URL)) || (window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) || window.revokeObjectURL;

var baseUri = makeUri();

var ctx;

var Count = false;

var EvStatus;

var onSigPenDown;

var onSigPenUp;

var SigWebFontThreshold = 155;

var NumPointsLastTime = 0;

var SigImageB64;

export function isIE() {
    return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec

    (navigator.userAgent) != null)));
}

export function isChrome() {
    var ua = navigator.userAgent;
    var chrome = false;

    //Javascript Browser Detection - Chrome
    if (ua.lastIndexOf('Chrome/') > 0) {
        //var version = ua.substr(ua.lastIndexOf('Chrome/') + 7, 2);
        return true;
    }
    else {
        return false;
    }
}

export function makeUri() {
    var prot = location.protocol;
    if (prot == "file:") {
        prot = 'http:';
    }

    if (isIE()) {
        if (prot == 'https:') {
            return (prot + "//tablet.sigwebtablet.com:47290/SigWeb/");
        }
        else {
            return (prot + "//tablet.sigwebtablet.com:47289/SigWeb/");
        }
    }

    if (isChrome()) {
        if (prot == 'https:') {
            return (prot + "//tablet.sigwebtablet.com:47290/SigWeb/");
        }
        else {
            return (prot + "//tablet.sigwebtablet.com:47289/SigWeb/");
        }
    }

    else {
        //FIREFOX
        if (prot == 'https:') {
            return (prot + "//tablet.sigwebtablet.com:47290/SigWeb/");
        }
        else {
            return (prot + "//tablet.sigwebtablet.com:47289/SigWeb/");
        }
    }
}

export function SigWebcreateXHR() {
    try {
        return new XMLHttpRequest();
    } catch (e) {
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
    }
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
    }

    alert("XMLHttpRequest not supported");
    return null;
}

export function SigWebSetProperty(prop) {
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("POST", baseUri + prop, true);
        xhr.send(null);
        if (xhr.readyState == 4 && xhr.status == 200) {
            return xhr.responseText;
        }
    }
    return "";
}

export function SigWebSetPropertySync(prop) {
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("POST", baseUri + prop, false);
        xhr.send();
        if (xhr.readyState == 4 && xhr.status == 200) {
            return xhr.responseText;
        }
    }
    return "";
}

export function SigWebSetStreamProperty(prop, strm) {
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("POST", baseUri + prop);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(strm);
//			if (xhr.readyState == 4 && xhr.status == 200) {
//				return xhr.responseText;
//			}
    }
    return "";
}

export function SigWebSetImageStreamProperty(prop, strm) {
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("POST", baseUri + prop, false);
        xhr.setRequestHeader("Content-Type", "image/png");
        xhr.send(strm);
        if (xhr.readyState == 4 && xhr.status == 200) {
            return xhr.responseText;
        }
    }
    return "";
}

export function SigWebSetImageBlobProperty(prop, strm) {
    var xhr = SigWebcreateXHR();

    //			var bb = new BlobBuilder();
    //			bb.append( strm );
    //			bb.append( "\0" );
    //			var blob = bb.getBlob( );

    if (xhr) {
        xhr.open("POST", baseUri + prop, false);
        xhr.setRequestHeader("Content-Type", "blob");
        xhr.send(strm);
        if (xhr.readyState == 4 && xhr.status == 200) {
            return xhr.responseText;
        }
    }
    return "";
}

export function SigWebGetProperty(prop) {
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("GET", baseUri + prop + "?noCache=" + generateUUID(), false);
        xhr.send(null);
        if (xhr.readyState == 4 && xhr.status == 200) {
            return xhr.responseText;
        }
    }
    return "";
}

//	function GetSigImageB64(callback) 
//		{
//		var cvs = document.createElement('canvas');
//		cvs.width = GetImageXSize();
//		cvs.height = GetImageYSize();
//
//		var xhr2 = new XMLHttpRequest();
//		xhr2.open("GET", baseUri + "SigImage/1", false);
//		xhr2.responseType = "blob";
//		xhr2.send(null);
//		if (xhr2.readyState == 4 && xhr.status == 200) 
//			{
//			var cntx = cvs.getContext('2d');
//			var img = new Image();
//			img.src = window.URL.createObjectURL(xhr2.response);
//			img.onload = function () 
//				{
//				cntx.drawImage(img, 0, 0);
//				var b64String = cvs.toDataURL("image/png");
//				var loc = b64String.search("base64,");
//				var retstring = b64String.slice(loc + 7, b64String.length);
//				if (callback) 
//					{
//					callback(retstring);
//					}
//				}
//			}
//		}

export function GetSigImageB64(callback) {
    var cvs = document.createElement('canvas');
    cvs.width = GetImageXSize();
    cvs.height = GetImageYSize();

    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", baseUri + "SigImage/1" + "?noCache=" + generateUUID(), true);
    xhr2.responseType = "blob";
    xhr2.send(null);
    xhr2.onload = function () {
        var cntx = cvs.getContext('2d');
        var img = new Image();
//			img.src = window.URL.createObjectURL(xhr2.response);
        img.src = getBlobURL(xhr2.response);
        img.onload = function () {
            cntx.drawImage(img, 0, 0);
            var b64String = cvs.toDataURL("image/png");
            var loc = b64String.search("base64,");
            var retstring = b64String.slice(loc + 7, b64String.length);
            if (callback) {
                callback(retstring);
            }
        }
    }
}

export function SigWebWaitForPenDown(callback) {
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("GET", baseUri + "WaitForPenDown" + "?noCache=" + generateUUID());
        xhr.timeout = 10000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4)
                return;
            if (xhr.status == 200)
                callback();
        }
        xhr.send(null);
    }
}

export function GetSigImage(ctx) {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", baseUri + "SigImage/1" + "?noCache=" + generateUUID(), true);
    xhr2.responseType = "blob";
    xhr2.send(null);
    xhr2.onload = function () {
        var img = new Image();
        img.src = getBlobURL(xhr2.response);
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            revokeBlobURL(this.src);
            img = null;
        }
    }
}

export function SigWebSetDisplayTarget(obj) {
    ctx = obj;
}

export function SigWebRefresh() {
    var NumPoints = NumberOfTabletPoints();
    if (NumPoints == NumPointsLastTime) {
        return;
    }
    NumPointsLastTime = NumPoints;

    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", baseUri + "SigImage/0" + "?noCache=" + generateUUID(), true);
    xhr2.responseType = "blob"
    xhr2.onload = function () {
        var img = new Image();
        img.src = getBlobURL(xhr2.response);
        //				img.src = window.URL.createObjectURL(xhr2.response);
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            revokeBlobURL(this.src);
            img = null;
        }
    }
    xhr2.send(null);
}

export function SigWebEvent() {
    var OldEvStatus = EvStatus;

    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("GET", baseUri + "EventStatus" + "?noCache=" + generateUUID(), true);
        xhr.onload = function () {
            EvStatus = xhr.responseText
            if ((OldEvStatus & 0x01) && (EvStatus & 0x02)) {
                if (onSigPenDown) {
                    onSigPenDown();
                }
            }

            if ((OldEvStatus & 0x02) && (EvStatus & 0x01)) {
                if (onSigPenUp) {
                    onSigPenUp();
                }
            }
        }
        xhr.send(null);
    }
}

export function generateUUID() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function setSigWebFontThreshold(v) {
    SigWebFontThreshold = v;
}

export function createLcdBitmapFromCanvas(ourCanvas, xp, yp, width, height) {
    var canvasCtx = ourCanvas.getContext('2d');
    var imgData = canvasCtx.getImageData(0, 0, width, height);
    var j = 0;
    var sVal = 0;
    var outData = "";
    var outIdx = 0;
    var data = imgData.data;

    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++) {
            var tmp1 = data[j];
            var tmp2 = data[j + 1];
            var tmp3 = data[j + 2];
            var tmp4 = data[j + 3];

            //					sVal = tmp1 + (tmp2 << 8 ) + ( tmp3 << 16 ) + (tmp4 << 24 );
            j = j + 4;
            if (tmp1 < SigWebFontThreshold) {
                outData += "B";
            }
            else {
                outData += "W";
            }
        }

    return outData;
}

export function toHex(NibVal) {
    switch (NibVal) {
        case 0:
            return "0";
        case 1:
            return "1";
        case 2:
            return "2";
        case 3:
            return "3";
        case 4:
            return "4";
        case 5:
            return "5";
        case 6:
            return "6";
        case 7:
            return "7";
        case 8:
            return "8";
        case 9:
            return "9";
        case 10:
            return "A";
        case 11:
            return "B";
        case 12:
            return "C";
        case 13:
            return "D";
        case 14:
            return "E";
        case 15:
            return "F";
    }
}

export function ToHexString(ByteVal) {
    var Str = "";
    Str += toHex((ByteVal >> 4) & 0x0f);
    Str += toHex(ByteVal & 0x0F);
    return Str
}

export function textToTablet(x, y, height, str, fnt) {
    var c = document.createElement('canvas');
    var cntx = c.getContext('2d');
    cntx.font = fnt;
    var txt = str;
    var xs = Math.round(cntx.measureText(txt).width);
    var ys = height;
    c.width = xs;
    c.height = ys;

    cntx.font = fnt;
    cntx.fillStyle = '#FFFFFF'
    cntx.rect(0, 0, xs, ys);
    cntx.fill();


    cntx.fillStyle = '#000000'
    cntx.textBaseline = "top";
    cntx.fillText(txt, 0, 0);

    cntx.drawImage(cntx.canvas, 0, 0, xs, ys);

    var Gstr = createLcdBitmapFromCanvas(c, 0, 0, xs, ys)

    LcdWriteImageStream(0, 2, x, y, xs, ys, Gstr);
}

export function LcdWriteImage(Dst, Mode, Xp, Yp, Url) {
    var Prop = "LcdWriteImage/";
    var NewUrl = Url.replace(/\//g, "_");

    Prop = Prop + Dst + "," + Mode + "," + Xp + "," + Yp + "," + NewUrl;
    SigWebSetPropertySync(Prop);
}

export function LcdWriteLocalImage(Dst, Mode, Xp, Yp, Url) {
    var Prop = "LcdWriteImage/";

    Prop = Prop + Dst + "," + Mode + "," + Xp + "," + Yp + "," + Url;
    SigWebSetProperty(Prop);
}

export function LcdWriteImageStream(Dst, Mode, Xp, Yp, Xs, Ys, Url) {
    var Prop1 = "LcdWriteImageStreamParams/" + Dst + "," + Mode + "," + Xp + "," + Yp + "," + Xs + "," + Ys;
    var Prop2 = "LcdWriteImageStream/";

    SigWebSetPropertySync(Prop1);
    SigWebSetImageStreamProperty(Prop2, Url);
}

export function LcdWriteImageBlob(Dst, Mode, Xp, Yp, Xs, Ys, Url) {
    var Prop = "LcdWriteImageStream/";

    Prop = Prop + Dst + "," + Mode + "," + Xp + "," + Yp + "," + Xs + "," + Ys;
    SigWebSetImageBlobProperty(Prop, Url);
}

export function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('lDiv');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult =
            {
                width: lDiv.clientWidth,
                height: lDiv.clientHeight
            };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}

//
//
//
//
//
//
//			Start of dll method wrappers
//
//
//			SigPlusNET.cs
//
export function GetVersionString() {
    var Prop = "Version";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);
    var trimStr = Str.slice(1, Str.length - 2);
    return trimStr;
}

export function IsPenDown() {
    return EvStatus & 0x01;
}

//
//			SigPlusNETSig.cs
//
export function ClearTablet() {
    var Prop = "ClearSignature";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function NumberOfTabletPoints() {
    var Prop = "TotalPoints";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

//		function  ExportSigFile(  FileName ) {}
//		function  ImportSigFile(  FileName ) {}

export function SetSigString(sigStr, ctx) {
    var Prop = "SigString";

    Prop = Prop;
    var xhr = SigWebcreateXHR();

    if (xhr) {
        xhr.open("POST", baseUri + Prop);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(sigStr);
        xhr.onload = function () {
            if (ctx) {
                var can = ctx.canvas;
                SetImageXSize(can.width);
                SetImageYSize(can.height);
                GetSigImage(ctx);
            }
        }
    }
    return "";
}

export function GetSigString() {
    var Prop = "SigString";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

export function SetSigCompressionMode(v) {
    var Prop = "CompressionMode/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetSigCompressionMode() {
    var Prop = "CompressionMode";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetEncryptionMode(v) {
    var Prop = "EncryptionMode/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetEncryptionMode() {
    var Prop = "EncryptionMode";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

//		function  SetKey( Keydata ) {}
//		function  GetKey( ) {}

export function SetKeyString(keyString) {
    var Prop = "KeyString";

    Prop = Prop;
    SigWebSetStreamProperty(Prop, keyString);
}

export function GetKeyString() {
    var Prop = "KeyString";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

export function AutoKeyStart() {
    var Prop = "AutoKeyStart";

    Prop = Prop;
    SigWebSetPropertySync(Prop);
}

export function AutoKeyFinish() {
    var Prop = "AutoKeyFinish";

    Prop = Prop;
    SigWebSetPropertySync(Prop);
}

export function SetAutoKeyData(keyData) {
    var Prop = "SetAutoKeyData";

    Prop = Prop;
    SigWebSetStreamProperty(Prop, keyData);
}

export function AutoKeyAddData(keyData) {
    var Prop = "AutoKeyAddData";

    Prop = Prop;
    SigWebSetStreamProperty(Prop, keyData);
    return GetKeyString();
}

//		function  GetKeyReceipt( ) {}

export function GetKeyReceiptAscii() {
    var Prop = "KeyReceiptAscii";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

//		function  GetSigReceipt( ) {}

export function GetSigReceiptAscii() {
    var Prop = "SigReceiptAscii";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

export function SetTimeStamp(timeStamp) {
    var Prop = "TimeStamp";

    Prop = Prop;
    SigWebSetStreamProperty(Prop, timeStamp);
}

export function GetTimeStamp() {
    var Prop = "TimeStamp";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

export function SetAnnotate(annotate) {
    var Prop = "Annotate";

    Prop = Prop;
    SigWebSetStreamProperty(Prop, annotate);
}

export function GetAnnotate() {
    var Prop = "Annotate";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

export function SetSaveSigInfo(v) {
    var Prop = "SaveSigInfo/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetSaveSigInfo() {
    var Prop = "SaveSigInfo";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetSavePressureData(v) {
    var Prop = "SavePressureData/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetSavePressureData() {
    var Prop = "SavePressureData";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetSaveTimeData(v) {
    var Prop = "SaveTimeData/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetSaveTimeData() {
    var Prop = "SaveTimeData";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetAntiAliasSpotSize(v) {
    var Prop = "AntiAliasSpotSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetAntiAliasSpotSize() {
    var Prop = "AntiAliasSpotSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetAntiAliasLineScale(v) {
    var Prop = "AntiAliasLineScale/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetAntiAliasLineScale() {
    var Prop = "AntiAliasLineScale";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function GetNumberOfStrokes() {
    var Prop = "NumberOfStrokes";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function GetNumPointsForStroke(v) {
    var Prop = "NumberOfPointsInStroke/";

    Prop = Prop + v;
    return SigWebGetProperty(Prop);
}

export function GetPointXValue(v1, v2) {
    var Prop = "PointXValue/";

    Prop = Prop + v1 + "/" + v2;
    return SigWebGetProperty(Prop);
}

export function GetPointYValue(v1, v2) {
    var Prop = "PointYValue/";

    Prop = Prop + v1 + "/" + v2;
    return SigWebGetProperty(Prop);
}

export function SetAntiAliasEnable(v) {
    var Prop = "AntiAliasEnable/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetAntiAliasEnable() {
    var Prop = "AntiAliasEnable";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetUseAmbientColors(v) {
    var Prop = "UseAmbientColors/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

//
//		SigPlusNETDisplay.cs
//
export function SetDisplayXSize(v) {
    var Prop = "DisplayXSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayXSize() {
    var Prop = "DisplayXSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayYSize(v) {
    var Prop = "DisplayYSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayYSize() {
    var Prop = "DisplayYSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayPenWidth(v) {
    var Prop = "DisplayPenWidth/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayPenWidth() {
    var Prop = "DisplayPenWidth";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayTimeStamp(v) {
    var Prop = "DisplayTimeStamp/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayTimeStamp() {
    var Prop = "DisplayTimeStamp";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayTimeStampPosX(v) {
    var Prop = "DisplayTimeStampPosX/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayTimeStampPosX() {
    var Prop = "DisplayTimeStampPosX";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayTimeStampPosY(v) {
    var Prop = "DisplayTimeStampPosY/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayTimeStampPosY() {
    var Prop = "DisplayTimeStampPosY";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayTimeStampSize(v) {
    var Prop = "DisplayTimeStampSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayTimeStampSize() {
    var Prop = "DisplayTimeStampSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayAnnotate(v) {
    var Prop = "DisplayAnnotate/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayAnnotate() {
    var Prop = "DisplayAnnotate";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayAnnotatePosX(v) {
    var Prop = "DisplayAnnotatePosX/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayAnnotatePosX() {
    var Prop = "DisplayAnnotatePosX";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayAnnotatePosY(v) {
    var Prop = "DisplayAnnotatePosY/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayAnnotatePosY() {
    var Prop = "DisplayAnnotatePosY";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetDisplayAnnotateSize(v) {
    var Prop = "DisplayAnnotateSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetDisplayAnnotateSize() {
    var Prop = "DisplayAnnotateSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

//
//		SigPlusNETImage.cs
//
//		function  GetSigImageB64( )
//			{
//			var xhr2 = new XMLHttpRequest();
//			xhr2.open("GET", baseUri + "SigImage/1", false );
//			xhr2.responseType = "blob"
//			xhr2.send(null);
//			if (xhr2.readyState == 4 && xhr.status == 200)
//				{
//				return window.URL.createObjectURL(xhr2.response);
//				}
//			return null;
//			}

export function SetImageXSize(v) {
    var Prop = "ImageXSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageXSize() {
    var Prop = "ImageXSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageYSize(v) {
    var Prop = "ImageYSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageYSize() {
    var Prop = "ImageYSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImagePenWidth(v) {
    var Prop = "ImagePenWidth/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImagePenWidth() {
    var Prop = "ImagePenWidth";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageTimeStamp(v) {
    var Prop = "ImageTimeStamp/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageTimeStamp() {
    var Prop = "ImageTimeStamp";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageTimeStampPosX(v) {
    var Prop = "ImageTimeStampPosX/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageTimeStampPosX() {
    var Prop = "ImageTimeStampPosX";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageTimeStampPosY(v) {
    var Prop = "ImageTimeStampPosY/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageTimeStampPosY() {
    var Prop = "ImageTimeStampPosY";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageTimeStampSize(v) {
    var Prop = "ImageTimeStampSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageTimeStampSize() {
    var Prop = "ImageTimeStampSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageAnnotate(v) {
    var Prop = "ImageAnnotate/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageAnnotate() {
    var Prop = "ImageAnnotate";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageAnnotatePosX(v) {
    var Prop = "ImageAnnotatePosX/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageAnnotatePosX() {
    var Prop = "ImageAnnotatePosX";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageAnnotatePosY(v) {
    var Prop = "ImageAnnotatePosY/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageAnnotatePosY() {
    var Prop = "ImageAnnotatePosY";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetImageAnnotateSize(v) {
    var Prop = "ImageAnnotateSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetImageAnnotateSize() {
    var Prop = "ImageAnnotateSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetJustifyX(v) {
    var Prop = "JustifyX/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetJustifyX() {
    var Prop = "JustifyX";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetJustifyY(v) {
    var Prop = "JustifyY/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetJustifyY() {
    var Prop = "JustifyY";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetJustifyMode(v) {
    var Prop = "JustifyMode/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetJustifyMode() {
    var Prop = "JustifyMode";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

//
//		SigPlusNETKeyPad.cs
//
export function KeyPadAddHotSpot(key, coord, xp, yp, xs, ys) {
    var Prop = "KeyPadAddHotSpot/";
    Prop = Prop + key + "," + coord + "," + xp + "," + yp + "," + xs + "," + ys;
    SigWebSetPropertySync(Prop);
}

export function KeyPadMarkHotSpot(key, coord, xp, yp, xs, ys) {
    LCDWriteString(0, 2, xp, yp, "16pt sans-serif", 32, "+")
    LCDWriteString(0, 2, xp + xs, yp, "16pt sans-serif", 32, "+")
    LCDWriteString(0, 2, xp, yp + ys, "16pt sans-serif", 32, "+")
    LCDWriteString(0, 2, xp + xs, yp + ys, "16pt sans-serif", 32, "+")
}

export function KeyPadQueryHotSpot(key) {
    var Prop = "KeyPadQueryHotSpot/";
    Prop = Prop + key;
    return SigWebGetProperty(Prop);
}

export function KeyPadClearHotSpotList() {
    var Prop = "KeyPadClearHotSpotList";
    SigWebSetPropertySync(Prop);
}

export function SetSigWindow(coords, xp, yp, xs, ys) {
    var Prop = "SigWindow/";
    Prop = Prop + coords + "," + xp + "," + yp + "," + xs + "," + ys;
    SigWebSetPropertySync(Prop);
}

export function ClearSigWindow(inside) {
    var Prop = "ClearSigWindow/";
    Prop = Prop + inside;
    SigWebSetPropertySync(Prop);
}

//
//		SigPlusNETLCD.cs
//
export function SetLCDCaptureMode(v) {
    var Prop = "CaptureMode/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetLCDCaptureMode() {
    var Prop = "CaptureMode";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function LCDSetWindow(xP, yP, xS, yS) {
    var Prop = "LCDSetWindow/";
    Prop = Prop + xP + "," + yP + "," + xS + "," + yS;
    SigWebSetPropertySync(Prop);
}

export function LCDWriteString(dest, mode, x, y, fnt, size, str) {
    var c = document.createElement('canvas');
    var cntx = c.getContext('2d');
    cntx.font = fnt;
    var txt = str;
    var xs = Math.round(cntx.measureText(txt).width);
    var ys = size;
    c.width = xs;
    c.height = ys;

    if (xs == 0) {
        return;
    }

    cntx.font = fnt;
    cntx.fillStyle = '#FFFFFF'
    cntx.rect(0, 0, xs, ys);
    cntx.fill();


    cntx.fillStyle = '#000000'
    cntx.textBaseline = "top";
    cntx.fillText(txt, 0, 0);

    cntx.drawImage(cntx.canvas, 0, 0, xs, ys);

    var Gstr = createLcdBitmapFromCanvas(c, x, y, xs, ys);

    LcdWriteImageStream(dest, mode, x, y, xs, ys, Gstr);
}

export function LCDDrawRectangle(dest, mode, x, y, xs, ys, fill) {
    var c = document.createElement('canvas');
    var cntx = c.getContext('2d');

    c.width = xs;
    c.height = ys;


    cntx.fillStyle = fill
    cntx.rect(0, 0, xs, ys);
    cntx.fill();

    cntx.drawImage(cntx.canvas, 0, 0, xs, ys);
    var Gstr = createLcdBitmapFromCanvas(c, x, y, xs, ys);
    LcdWriteImageBlob(dest, mode, x, y, xs, ys, Gstr);
}

export function LCDDrawButton(dest, mode, x, y, xs, ys, strys, fill, fnt, str) {
    var c = document.createElement('canvas');
    var cntx = c.getContext('2d');
    cntx.font = fnt;
    var txt = str;
    var sxs = Math.round(cntx.measureText(txt).width);
    var sys = strys;
    c.width = xs;
    c.height = ys;

    cntx.font = fnt;
    cntx.fillStyle = fill
    cntx.rect(0, 0, xs, ys);
    cntx.fill();


    cntx.fillStyle = '#FFFFFF'
    cntx.textBaseline = "top";
    cntx.fillText(txt, ((xs - sxs) / 2), ((ys - sys) / 2));

    cntx.drawImage(cntx.canvas, 0, 0, xs, ys);

    var Gstr = createLcdBitmapFromCanvas(c, x, y, xs, ys);

    LcdWriteImageBlob(dest, mode, x, y, xs, ys, Gstr);
}

export function LCDWriteStringWindow(dest, mode, x, y, fnt, xsize, ysize, str) {
    var c = document.createElement('canvas');
    var cntx = c.getContext('2d');
    cntx.font = fnt;
    var txt = str;
    var xs = xsize;
    var ys = ysize;
    c.width = xs;
    c.height = ys;

    cntx.font = fnt;
    cntx.fillStyle = '#FFFFFF'
    cntx.rect(0, 0, xs, ys);
    cntx.fill();


    cntx.fillStyle = '#000000'
    cntx.textBaseline = "top";
    cntx.fillText(txt, 0, 0);

    cntx.drawImage(cntx.canvas, 0, 0, xs, ys);

    var Gstr = createLcdBitmapFromCanvas(c, x, y, xs, ys);

    LcdWriteImageBlob(dest, mode, x, y, xs, ys, Gstr);
}

export function LCDStringWidth(fnt, str) {
    var c = document.createElement('canvas');
    var cntx = c.getContext('2d');
    cntx.font = fnt;
    var txt = str;
    var xs = Math.round(cntx.measureText(txt).width);

    return xs;
}

export function LCDStringHeight(fnt, str) {
    return 16;
}

export function LcdRefresh(Mode, Xp, Yp, Xs, Ys) {
    var Prop = "LcdRefresh/";

    Prop = Prop + Mode + "," + Xp + "," + Yp + "," + Xs + "," + Ys;
    SigWebSetPropertySync(Prop);
}

export function LCDSendCmdString(CmdStr, ReturnCount, Result, TimeOut) {
    var Prop = "LcdSendCmdString/";

    Prop = Prop + ReturnCount + "," + TimeOut;
    Result = SigWebSetStreamProperty(Prop, CmdStr);
}

export function LCDSendCmdData(CmdStr, ReturnCount, Result, TimeOut) {
    var Prop = "LcdSendCmdData/";

    Prop = Prop + ReturnCount + "," + TimeOut;
    Result = SigWebSetStreamProperty(Prop, CmdStr);
}

export function LCDSendGraphicCanvas(dest, mode, x, y, canvas) {
    var Gstr = createLcdBitmapFromCanvas(canvas, 0, 0, xs, ys)
    LcdWriteImageStream(dest, mode, x, y, canvas.width, canvas.height, Gstr);
}

//		function  LCDSendWindowedGraphicCanvas(  dest, mode,  x,  y, canvas )
//			 {
//			 }

//		function  LCDSendWindowedGraphicCanvas(  dest, mode,  x,  y,  xs,  ys, canvas )
//			{
//			var Gstr = createLcdBitmapFromCanvas( canvas, 0, 0, xs, ys)
//			LcdWriteImageStream( dest, mode, x, y, xs, ys, Gstr );
//			}

export function LCDSendWindowedGraphicCanvas(dest, mode, x, y, xs, ys, c, xps, yps) {
    var Gstr = createLcdBitmapFromCanvas(canvas, xps, yps, xs, ys)
    LcdWriteImageStream(dest, mode, x, y, xs, ys, Gstr);
}

export function LCDSendGraphicUrl(dest, mode, x, y, url) {
    LcdWriteImage(dest, mode, x, y, url)
}

//		function  LCDSendWindowedGraphicUrl(  dest, mode,  X,  Y, url )
//			{
//			}

//		function  LCDSendWindowedGraphicUrl(  dest, mode,  x,  y,  xs,  ys, url )
//			{
//			LcdWriteImageStream(dest, mode, x, y, xs, ys, url);
//			}

export function LCDSendWindowedGraphicUrl(dest, mode, x, y, xse, yse, url, xps, yps) {
    LcdWriteImageStream(dest, mode, x, y, xs, ys, url);
}

//		function  LCDSendGraphic(  Dest,  Mode,  XPos,  YPos,  ImageFileName ) {}
//		function  LCDSendGraphicURL(  Dest,  Mode,  XPos,  YPos,  URL ) {}

export function LCDClear() {
    var Prop = "LcdClear";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function LCDSetTabletMap(LCDType, LCDXSize, LCDYSize, LCDXStart, LCDYStart, LCDXStop, LCDYStop) {
}

export function LCDSetPixelDepth(v) {
    var Prop = "LcdSetPixelDepth/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function LCDGetLCDSize() {
    var Prop = "LcdGetLcdSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function LCDSetCompressionMode(NewMode) {
    var Prop = "LcdCompressionMode/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function LCDGetCompressionMode() {
    var Prop = "LcdCompressionMode";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function LCDSetZCompressionMode(NewMode) {
    var Prop = "LcdZCompressionMode/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function LCDGetZCompressionMode() {
    var Prop = "LcdZCompressionMode";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

//
//		SigPlusNETLCD.cs
//

export function SetRealTabletState(v) {
    var Prop = "TabletState/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletState() {
    var Prop = "TabletState";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletLogicalXSize(v) {
    var Prop = "TabletLogicalXSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletLogicalXSize() {
    var Prop = "TabletLogicalXSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function GetTabletLogicalYSize() {
    var Prop = "TabletLogicalYSize";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletLogicalYSize(v) {
    var Prop = "TabletLogicalYSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetTabletXStart(v) {
    var Prop = "TabletXStart/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletXStart() {
    var Prop = "TabletXStart";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletYStart(v) {
    var Prop = "TabletYStart/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletYStart() {
    var Prop = "TabletYStart";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletXStop(v) {
    var Prop = "TabletXStop/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletXStop() {
    var Prop = "TabletXStop";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletYStop(v) {
    var Prop = "TabletYStop/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletYStop() {
    var Prop = "TabletYStop";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletFilterPoints(v) {
    var Prop = "TabletFilterPoints/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletFilterPoints() {
    var Prop = "TabletFilterPoints";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletTimingAdvance(v) {
    var Prop = "TabletTimingAdvance/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletTimingAdvance() {
    var Prop = "TabletTimingAdvance";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletComPort(v) {
    var Prop = "TabletComPort/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletComPort() {
    var Prop = "TabletComPort";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletBaudRate(v) {
    var Prop = "TabletBaudRate/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletBaudRate() {
    var Prop = "TabletBaudRate";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletRotation(v) {
    var Prop = "TabletRotation/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletRotation() {
    var Prop = "TabletRotation";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletType(v) {
    var Prop = "TabletType/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletType() {
    var Prop = "TabletType";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetServerTabletType(v) {
    var Prop = "ServerTabletType/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetServerTabletType() {
    var Prop = "ServerTabletType";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletComTest(v) {
    var Prop = "TabletComTest/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletComTest() {
    var Prop = "TabletComTest";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletResolution(v) {
    var Prop = "TabletResolution/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetTabletResolution() {
    var Prop = "TabletResolution";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function TabletConnectQuery() {
    var Prop = "TabletConnectQuery";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function TabletModelNumber() {
    var Prop = "TabletModelNumber";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function TabletSerialNumber() {
    var Prop = "TabletSerialNumber";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletPortPath(v) {
    var Prop = "TabletPortPath/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetTabletLocalIniFilePath(v) {
    var Prop = "TabletLocalIniFilePath/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetTabletModel(v) {
    var Prop = "TabletModel/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetSerialPortCloseDelay(v) {
    var Prop = "SerialPortCloseDelay/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetSerialPortCloseDelay() {
    var Prop = "SerialPortCloseDelay";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function EnableTabletEncryption() {
    var Prop = "EnableTabletEncryption";

    Prop = Prop;
    SigWebSetPropertySync(Prop);
}

export function SetTabletEncryptionMode(hmode, tmode) {
    var Prop = "TabletEncryptionMode/";

    Prop = Prop + hmode + "," + tmode;
    SigWebSetPropertySync(Prop);
}

export function SetMaxLogFileSize(v) {
    var Prop = "MaxLogFileSize/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetSigSockServerPath() {
    var Prop = "SigSockServerPath";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function GetSigSockClientName() {
    var Prop = "SigSockClientName";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function GetSigSockPortNumber() {
    var Prop = "SigSockPortNumber";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetSigSockServerPath(v) {
    var Prop = "SigSockServerPath/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetSigSockClientName(v) {
    var Prop = "SigSockClientName/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetPortNumber(v) {
    var Prop = "PortNumber/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function SetSigSockPortNumber(v) {
    var Prop = "SigSockPortNumber/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function GetFirmwareRevision() {
    var Prop = "FirmwareRevision";

    Prop = Prop;
    return SigWebGetProperty(Prop);
}

export function SetTabletData(sigStr) {
    var Prop = "TabletData";

    Prop = Prop;
    SigWebSetStreamProperty(Prop, sigStr);
}

export function GetTabletData() {
    var Prop = "TabletData";

    Prop = Prop;
    var Str = SigWebGetProperty(Prop);

    return Str.slice(1, Str.length - 1);
}

export function OpenTablet(v) {
    var Prop = "OpenTablet/";

    Prop = Prop + v;
    SigWebSetPropertySync(Prop);
}

export function CloseTablet() {
    var Prop = "CloseTablet";

    Prop = Prop;
    SigWebSetProperty(Prop);
}

export function ResetParameters() {
    var Prop = "ResetParameters";

    Prop = Prop;
    SigWebSetPropertySync(Prop);
}

export function testRawData() {
    OpenTablet(1);
    var Str1 = GetTabletData();
    CloseTablet();
}

export function SetTabletState(v, ctx, tv) {
    var delay;


    if (tv) {
        delay = tv;
    }
    else {
        delay = 100;
    }

    if (GetTabletState() != v) {
        if (v == 1) {
            if (ctx) {
                var can = ctx.canvas;
                SetDisplayXSize(can.width);
                SetDisplayYSize(can.height);
                SigWebSetDisplayTarget(ctx);
            }
            SetRealTabletState(v);
            if (ctx && (GetTabletState() != 0)) {
                var tmr = setInterval(SigWebRefresh, delay);
            }
            else {
                var tmr = null;
            }

            return tmr;
        }
        else {
            if (ctx) {
                clearInterval(ctx);
            }
            SigWebSetDisplayTarget(null);
            SetRealTabletState(v);
        }
    }
    return null;
}
		
