
import { MaterialType, NettingType, SimulationStats, WeatherType, Language } from "../types";

// Key generation helper
const getKey = (material: MaterialType, netting: NettingType, hasStyrofoam: boolean) => 
  `${material}_${netting}_${hasStyrofoam}`;

// Analysis Database supporting multiple languages
const ANALYSIS_DB: Record<string, { EN: string, TC: string }> = {
  // --- METAL SCENARIOS ---
  [`${MaterialType.METAL}_${NettingType.NONE}_false`]: {
    EN: "Metal acts as a massive heat sink with high conductivity. Without flammable netting or debris to sustain the fire, the heat dissipated rapidly across the frame. Structural integrity remained intact as temperatures did not sustain the critical 600°C failure point.",
    TC: "金屬具有高導熱性，充當巨大的散熱器。在沒有易燃網或雜物維持火勢的情況下，熱量迅速散發。溫度未持續達到 600°C 的臨界失效點，結構保持完整。"
  },

  [`${MaterialType.METAL}_${NettingType.NONE}_true`]: {
    EN: "Styrofoam debris ignited (~240°C), causing intense localized heating and molten dripping. While the metal structure conducted heat away rapidly, preventing widespread collapse, the dripping plastic created dangerous downward fire hazards affecting lower levels.",
    TC: "發泡膠被點燃（~240°C），導致局部劇烈升溫並產生熔滴。雖然金屬結構迅速導熱防止了廣泛倒塌，但滴落的熔融塑料對下方樓層構成了危險。"
  },

  [`${MaterialType.METAL}_${NettingType.NON_FIRE_RESISTANT}_false`]: {
    EN: "The non-compliant netting acted as a vertical wick (Flashover), causing fire to race up the facade. Although metal dissipates heat, the sheer surface area of burning netting sustained high temperatures. The structure likely survived, but the rapid vertical spread poses extreme risk to occupants.",
    TC: "不合規的棚網起到了垂直燈芯的作用（閃燃），導致火勢沿外牆迅速向上蔓延。雖然金屬能散熱，但燃燒棚網的大面積產生了高溫。結構可能倖存，但快速的垂直蔓延對人員構成極大風險。"
  },

  [`${MaterialType.METAL}_${NettingType.NON_FIRE_RESISTANT}_true`]: {
    EN: "Critical Scenario: The combination of flammable netting and melting Styrofoam created a catastrophic feedback loop. Netting drove vertical spread, while molten foam intensified heat and dripped downwards. Steel temperatures likely exceeded critical softening points (~500°C), creating a high risk of deformation.",
    TC: "危險場景：易燃棚網與熔融發泡膠的結合產生了災難性的反饋循環。棚網推動了垂直蔓延，而熔融發泡膠加劇了熱量並向下滴落。鋼材溫度可能超過臨界軟化點（~500°C），變形風險極高。"
  },

  [`${MaterialType.METAL}_${NettingType.FIRE_RESISTANT}_false`]: {
    EN: "The Fire-Resistant netting successfully prevented vertical flashover. The fire remained contained at the source. The metal structure effectively managed the thermal load via conductivity, resulting in minimal structural damage.",
    TC: "阻燃棚網成功防止了垂直閃燃。火勢被控制在源頭。金屬結構通過導熱有效管理了熱負荷，結構損壞極小。"
  },

  [`${MaterialType.METAL}_${NettingType.FIRE_RESISTANT}_true`]: {
    EN: "Styrofoam caused intense local burning and dripping, but the Fire-Resistant netting prevented the characteristic high-rise vertical spread. Damage was limited to the immediate vicinity of the debris, with the metal structure surviving the localized heat load.",
    TC: "發泡膠導致了劇烈的局部燃燒和滴落，但阻燃棚網防止了典型的高層垂直蔓延。損壞僅限於雜物附近，金屬結構承受住了局部熱負荷。"
  },

  // --- BAMBOO SCENARIOS ---
  [`${MaterialType.BAMBOO}_${NettingType.NONE}_false`]: {
    EN: "Bamboo ignited (~300°C) and burned fiercely but locally. High thermal capacity delayed ignition, and without netting to bridge the vertical gap, the fire consumed the organic structure at the source but struggled to spread rapidly upwards.",
    TC: "竹棚被點燃（~300°C）並劇烈但局部的燃燒。高熱容延遲了點燃，且沒有棚網連接垂直間隙，火勢在源頭消耗了有機結構，但難以迅速向上蔓延。"
  },

  [`${MaterialType.BAMBOO}_${NettingType.NONE}_true`]: {
    EN: "Styrofoam acts as an accelerant, rapidly raising bamboo to ignition temperature. Molten plastic dripped onto lower levels, igniting bamboo below. While vertical spread was slower than with netting, the organic fuel load led to significant local structural loss.",
    TC: "發泡膠起到了助燃劑的作用，迅速將竹子加熱至燃點。熔融發泡膠滴落到下層，點燃下方的竹棚。雖然垂直蔓延比有網時慢，但有機燃料負荷導致了顯著的局部結構損失。"
  },

  [`${MaterialType.BAMBOO}_${NettingType.NON_FIRE_RESISTANT}_false`]: {
    EN: "High Risk. The netting caught fire instantly, acting as a ladder for flames. This pre-heated the bamboo above, leading to a full-structure conflagration. The bamboo added a massive fuel load, sustaining the fire far longer than metal would.",
    TC: "高風險。棚網瞬間著火，充當火焰的階梯。這預熱了上方的竹子，導致整個結構的大火。竹棚增加了巨大的燃料負荷，使火勢持續時間遠長於金屬。"
  },

  [`${MaterialType.BAMBOO}_${NettingType.NON_FIRE_RESISTANT}_true`]: {
    EN: "Catastrophic Failure. Netting facilitated rapid vertical spread, while Styrofoam added intense heat and downward dripping. Structural loss is expected due to the combined fuel load and vertical bridging.",
    TC: "災難性失效。棚網促進了快速的垂直蔓延，而發泡膠增加了劇烈熱量和向下滴落。預計由於組合燃料負荷和垂直連接，結構將完全損失。"
  },

  [`${MaterialType.BAMBOO}_${NettingType.FIRE_RESISTANT}_false`]: {
    EN: "The FR netting resisted ignition, breaking the vertical chain reaction. Bamboo burned at the ignition point, but the fire remained contained. The lack of a 'chimney effect' prevented widespread destruction of the scaffolding.",
    TC: "阻燃棚網抵抗了點燃，打破了垂直連鎖反應。竹子在點火點燃燒，但火勢保持被控制。缺乏「煙囪效應」防止了棚架的廣泛破壞。"
  },

  [`${MaterialType.BAMBOO}_${NettingType.FIRE_RESISTANT}_true`]: {
    EN: "Styrofoam burned rapidly, destroying local bamboo poles. However, the FR netting prevented the fire from jumping floors. The result was severe local damage to the organic structure, but no widespread high-rise conflagration occurred.",
    TC: "發泡膠迅速燃燒，破壞了局部的竹竿。然而，阻燃網防止了火勢跳層。結果是有機結構受到嚴重的局部損壞，但未發生廣泛的高層大火。"
  }
};

export const generateAnalysis = async (
  material: MaterialType,
  netting: NettingType,
  hasStyrofoam: boolean,
  weather: WeatherType,
  stats: SimulationStats,
  lang: Language
): Promise<string> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 600));

  const key = getKey(material, netting, hasStyrofoam);
  const baseAnalysis = ANALYSIS_DB[key]?.[lang] || (lang === 'TC' ? "此配置暫無分析。" : "Analysis not available for this configuration.");
  
  let weatherContext = "";
  
  if (weather === WeatherType.WET) {
      weatherContext = lang === 'TC' 
        ? " 此外，潮濕的天氣條件通過增加冷卻速率並降低點燃概率，抑制了火勢的發展。"
        : " Furthermore, wet weather conditions dampened the fire's progression by increasing the cooling rate and reducing the ignition probability.";
  } else if (weather === WeatherType.DRY) {
      weatherContext = lang === 'TC'
        ? " 此外，乾燥的天氣條件顯著加速了蔓延，因為缺乏水分使材料在達到臨界溫度時立即點燃。"
        : " Additionally, dry weather conditions significantly accelerated the spread, as the lack of moisture allowed materials to ignite instantly upon reaching critical temperatures.";
  }

  // Append dynamic stats summary
  const summaryHeader = lang === 'TC' ? "觀測數據：" : "Observed Data:";
  const peakTempLabel = lang === 'TC' ? "最高溫度" : "Peak Temperature";
  const maxAreaLabel = lang === 'TC' ? "最大火場面積" : "Max Fire Area";
  const unitsLabel = lang === 'TC' ? "單元" : "units";
  const damageLabel = lang === 'TC' ? "結構損壞" : "Structural Damage";
  const unitsLostLabel = lang === 'TC' ? "單元損失" : "units lost";
  const durationLabel = lang === 'TC' ? "火災持續時間" : "Fire Duration";
  const ticksLabel = lang === 'TC' ? "刻 (ticks)" : "ticks";

  const summary = `
    ${summaryHeader}
    - ${peakTempLabel}: ${stats.peakTemp.toFixed(1)}°C
    - ${maxAreaLabel}: ${stats.maxFireArea} ${unitsLabel}
    - ${damageLabel}: ${stats.collapsedCount + stats.burntCount} ${unitsLostLabel}.
    - ${durationLabel}: ${stats.fireDuration} ${ticksLabel}.
  `;

  return `${baseAnalysis}${weatherContext}\n\n${summary}`;
};
