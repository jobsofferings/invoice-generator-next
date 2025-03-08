import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserInfoList = () => {
  return [
    {
      name: "Jobs",
      email: "Jobs@example.com",
      phone: "1234567890",
      ccc: '+86',
      sign_png: 'https://jobsofferings.oss-cn-hangzhou.aliyuncs.com/screenshot-20250308-165706.png',
    },
    {
      name: "Mikasa",
      email: "Mikasa@example.com",
      phone: "1234567890",
      ccc: '+86',
      sign_png: 'https://jobsofferings.oss-cn-hangzhou.aliyuncs.com/screenshot-20250308-165706.png',
    },
    {
      name: "yi king",
      email: "yi_king@example.com",
      phone: "1234567890",
      ccc: '+86',
      sign_png: 'https://jobsofferings.oss-cn-hangzhou.aliyuncs.com/screenshot-20250308-165706.png',
    }
  ]
}

export const getCompanyLogoList = () => {
  return [
    {
      name: "quanhom",
      logo: 'https://jobsofferings.oss-cn-hangzhou.aliyuncs.com/20250308-160641.jpeg',
    }
  ]
}

export const getMarksWithCompany = (company: string) => {
  if (company === 'quanhom') {
    return `
SAY US DOLLARS FOUR THOUSAND ONE HUNDRED AND SEVENTY-FIVE ONLY.
Remark:
1. Bank transaction fee shall be paid by customer.
Please select OUR when making a remittance.
2. Payment is proceeded by 100% TT in advance.
3. Delivery Date: About 3 months(holiday excepted) after receiving the payment.
Bank Information:
Beneficiary:
Hangzhou Quanhom Technology Co., Ltd
Beneficiary bank:
BANK OF CHINA HANGZHOU WESTERN CITY
SCIENTIFIC AND TECHNOLOGICAL INNOVATION BRANCH
SWIFT CODE: BKCHCNBJ910
Beneficiary Account Number: For USD
359784119805
Bank address:
BUILDING NO.4 OVERSEAS HIGH-LEVEL CULTURAL INNOVATION PARK,NO.998 WEST WENYI ROAD HANGZHOU ZHEJIANG IN CHINA
    `
  }
  return ''
}

export const getInformationWithCompany = (company: string) => {
  if (company === 'quanhom') {
    return `
Hangzhou Quanhom Technology Co., Ltd
Add: 5F&6F Bid 1, Future Star, Yuhang Dist,
Hangzhou 311121 Zhejiang, China
Tel: +86 (0)571 8861 2325
Fax: +86 (0)571 8861 2503
E-mail:info@quanhom.com
Http://ww.quanhom.com    
    `
  }
  return ''
}