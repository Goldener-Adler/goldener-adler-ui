export const ISO_ALPHA2_CODES = [
  "AF","AL","DZ","AS","AD","AO","AG","AR","AM","AU","AT","AZ",
  "BS","BH","BD","BB","BY","BE","BZ","BJ","BT","BO","BA","BW",
  "BR","BN","BG","BF","BI","KH","CM","CA","CV","CF","TD","CL",
  "CN","CO","KM","CG","CR","HR","CU","CY","CZ","DK","DJ","DM",
  "DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FJ","FI","FR",
  "GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT",
  "HN","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP",
  "JO","KZ","KE","KI","KR","KW","KG","LA","LV","LB","LS","LR",
  "LY","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR",
  "MU","MX","FM","MD","MC","MN","ME","MA","MZ","MM","NA","NR",
  "NP","NL","NZ","NI","NE","NG","NO","OM","PK","PW","PA","PG",
  "PY","PE","PH","PL","PT","QA","RO","RU","RW","KN","LC","VC",
  "WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB",
  "SO","ZA","ES","LK","SD","SR","SE","CH","SY","TW","TJ","TZ",
  "TH","TL","TG","TO","TT","TN","TR","TM","TV","UG","UA","AE",
  "GB","US","UY","UZ","VU","VA","VE","VN","YE","ZM","ZW"
];

function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export function getNationalities(locale: string = "de") {
  const regionNames = new Intl.DisplayNames([locale], {
    type: "region"
  });

  const collator = new Intl.Collator(locale, {
    sensitivity: "base", // Case-insensitive, accent-sensitive
  });

  // ISO-3166-1 alpha-2 Codes (gekürzt hier – vollständig unten)
  return ISO_ALPHA2_CODES.map((code) => {
    const countryName = regionNames.of(code) || code;

    return {
      value: code.toLowerCase(),
      label: `${getFlagEmoji(code)} ${countryName}`
    };
  }).sort((a, b) => {
    const nameA = a.label.replace(/^[^ ]+ /, "");
    const nameB = b.label.replace(/^[^ ]+ /, "");
    return collator.compare(nameA, nameB);
  });
}