import { ContentState, EditorState } from "draft-js"
import htmlToDraft from "html-to-draftjs"

export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
  }
  return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`.trim()
}

export const convertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const separattionFullName = (fullName: string, language: string) => {
  const result = {
    firstName: "",
    middleName: "",
    lastName: ""
  }
  const arrFullName = fullName.trim().split(' ')?.filter(Boolean)
  if(arrFullName.length === 1){
    if(language === "vi"){
      result.firstName = arrFullName[0]   
    }else if(language === "en"){
      result.lastName = arrFullName[0]
    }
  }else if(arrFullName?.length === 2){
    if(language === "vi"){
      result.lastName = arrFullName[0]
      result.firstName = arrFullName[1]     
    }else if(language === "en"){
      result.lastName = arrFullName[1]
      result.firstName = arrFullName[0]   
    }
  }else if(arrFullName?.length >= 3){
    if(language === "vi"){
      result.lastName = arrFullName[0]
      result.middleName = arrFullName.slice(1, arrFullName.length -1).join(" ")
      result.firstName = arrFullName[arrFullName.length - 1]
    }else if(language === "en"){
      result.lastName = arrFullName[arrFullName.length - 1]
      result.middleName = arrFullName.slice(1, arrFullName.length -1).join(" ")
      result.firstName = arrFullName[0]
    }
  }
  return result
}


export const getAllValueOfObject = (obj: any, arrExlude?: string[]) => {
  try {
    const values: any[] = []
    for (const key in obj) {
      //kiem tra xem neu obj truyen vao co them obj con ==> goi lai ham de lay gia tri cua obj con
      if (typeof obj[key] === 'object') {
        values.push(...getAllValueOfObject(obj[key], arrExlude))
      } else {
        //lay gia trị ko trung voi gia tri truyen vao tu arrExlude
        if (!arrExlude?.includes(obj[key])) {
          values.push(obj[key])
        }
      }
    }

    return values
  } catch (error) {
    return []
  }
}

export const formatNumberToLocal = (value: string | number) => {
  try {
    return Number(value).toLocaleString('vi-VN', {
      minimumFractionDigits: 0
    })
  } catch (error) {
    return value
  }
}

export const convertHTMLToDraft = (html: string) => {
  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
  const editorState = EditorState.createWithContent(contentState)

  return editorState
}

export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return str
}
