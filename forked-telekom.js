// creator: https://github.com/Sillium | changed by me, https://github.com/LupusArgentum
const apiUrl = "https://pass.telekom.de/api/service/generic/v1/status"
const logoIsWanted = (args.widgetParameter == "logo")

let widget = await createWidget()
if (!config.runsInWidget) await widget.presentSmall()
Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let jsonLocalPath = fm.joinPath(dir, "scriptable-telekom.json")
  let lastFetchDateLocalPath = fm.joinPath(dir, "lastUpdate.txt")

  const list = new ListWidget()
  list.addSpacer()
 
  try {
    let r = new Request(apiUrl)
  // API only answers for mobile Safari
    r.headers = {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1"
    }
    let data = false, api_online = false, lastFetchDate = false
    try {
      // Fetch data from pass.telekom.de
      data = await r.loadJSON()
      // Write JSON to local file
      fm.writeString(jsonLocalPath, JSON.stringify(data, null, 2))
      api_online = true
      lastFetchDate = new Date()
      fm.writeString(lastFetchDateLocalPath, lastFetchDate.toString())
    } catch (err) {
      console.log(err)
      // Read data from local file
      if (fm.fileExists(jsonLocalPath) && fm.fileExists(lastFetchDateLocalPath)) {
        data = JSON.parse(fm.readString(jsonLocalPath), null)
        lastFetchDate = new Date(fm.readString(lastFetchDateLocalPath, null))
      } else {
        const errorList = new ListWidget()
        errorList.addText("Please disable WiFi for initial execution.")
        return errorList
      }
    }
   
    let line1
    let stack = list.addStack()
    
    // if an additional datapass is booked, display "Pass:" + passname, else display "Datenvolumen:"
    if (data.passName == "Ihr Datenvolumen" || data.passName == "Ihr Telekom Datentarif") { // you may need to change this! (check your pass name)
      line1 = stack.addText("Datenvolumen")
    } else line1 = stack.addText("Pass: " + data.passName)
    
    line1.font = Font.mediumSystemFont(13)
    if (logoIsWanted) addLogoToLine1(stack)

    // change color of the remaining volume according to usage
    const line2 = list.addText(100-data.usedPercentage + "%")
    line2.font = Font.boldSystemFont(36)
    
    if (data.usedPercentage >= 90) line2.textColor = Color.red()
    else if (data.usedPercentage >= 75) line2.textColor = Color.orange()
    else if (data.usedPercentage >= 50) line2.textColor = Color.yellow()
    else line2.textColor = Color.green()

    const line3 = list.addText(data.usedVolumeStr)
    line3.font = Font.boldSystemFont(13)
    
    const line4 = list.addText("von " + data.initialVolumeStr + " verbraucht")
    line4.font = Font.mediumSystemFont(10)
    
    list.addSpacer()
    let line5
	 
    // alt text on line5 if local data instead of Telekom API data:
    if (api_online) {
      let plan = (data.remainingSeconds ? "prepaid" : data.remainingTimeStr ? "postpaid" : "")
      switch (plan) {
        case "prepaid":
          let days = Math.floor(data.remainingSeconds / 86400)
          let hours = Math.floor((data.remainingSeconds % 86400) / 3600)
          line5 = list.addText("noch " + days + "d " + hours + "h übrig")
          line5.font = Font.mediumSystemFont(12)
          line5.textColor = (days < 3 ? Color.red() : Color.green())
          break;
      
        case "postpaid":
          line5 = list.addText("gültig bis:\n" + data.remainingTimeStr)
          line5.font = Font.mediumSystemFont(12)
          break;
      }
      
    } else {
        line5 = list.addText("API offline")
        line5.font = Font.boldSystemFont(12)
        line5.textColor = Color.orange()
    }
    
    // Add time (and date) of last data fetch
    const df = new DateFormatter()
    const wasUpdatedToday = (lastFetchDate.getDate() == new Date().getDate())
    df.dateFormat = (wasUpdatedToday ? "hh:mm" : "dd.MM. hh:mm")
    
    let timeLabel = list.addText("aktualisiert " + df.string(lastFetchDate))
    timeLabel.font = Font.mediumSystemFont(9)
    timeLabel.textColor = Color.lightGray()
    list.addSpacer()
      
  } catch (err) {
    console.log(err)
    list.addText("Error fetching JSON from https://pass.telekom.de/api/service/generic/v1/status")
  }
 
  return list
}


async function addLogoToLine1(stack) {
  const imageUrl = "https://www.telekom.de/resources/images/322188/meine-telekom-v3-graphical-256.png"
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, "tel.png")
  stack.addSpacer()
  if (fm.fileExists(path)) { 
    let telekomImage = fm.readImage(path)
    let stackImage = stack.addImage(telekomImage)
    stackImage.rightAlignImage()
    stackImage.imageSize = new Size(16,16)
  } else {
    // download once
    let telekomImage = await loadImage(imageUrl)
    fm.writeImage(path, telekomImage)
    let stackImage = stack.addImage(telekomImage)
    stackImage.rightAlignImage()
    stackImage.imageSize = new Size(16,16)
  }
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
