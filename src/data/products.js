/* ────────────────────────────────────────────────────────────────────
   BKT range we distribute — the featured patterns from each sector page of
   commercial.bkt-tires.com (Agriculture, Industrial & Construction, OTR).
   Copy, sizes and Sketchfab 3D model ids are taken from each pattern page;
   cut-out renders are saved in src/assets/products/<slug>.webp.

   video: the YouTube film BKT embeds on that pattern page (only five have one).
   sizes: "SIZE|VERSION|LI/SS|RIM (REC)|OD mm" — metric table, one row per
   size/version/load-index combination as BKT lists it.
   ──────────────────────────────────────────────────────────────────── */

/* The client's two range PDFs — "OTR Tire Product Range" and "Agriculture
   Tires Product Range - Nepal" — every pattern in each, matched to its BKT
   pattern page (agriculture from BKT's India site). In each JSON, `groups`
   are the PDF's machine sections and `stock` the sizes it lists for Nepal. */
import otrRange from './otrRange.json'
import agriRange from './agriRange.json'

const images = import.meta.glob('../assets/products/*.webp', { eager: true, import: 'default' })
const imageFor = (slug) => images[`../assets/products/${slug}.webp`]
/* 560px-tall copies for the grid cards — the full renders are ~1100px. */
const thumbs = import.meta.glob('../assets/products/thumb/*.webp', { eager: true, import: 'default' })
const thumbFor = (slug) => thumbs[`../assets/products/thumb/${slug}.webp`] || imageFor(slug)

export const sectors = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    short: 'Agri',
    lede: 'Tyres for tractors, harvesters and trailers — traction in the field, comfort on the road, and less compaction in the soil.',
  },
  {
    id: 'otr',
    name: 'OTR',
    short: 'OTR',
    lede: 'Off-the-road tyres for tippers, loaders, graders, cranes, compactors, port machines and forklifts — built for sites, quarries and heavy work.',
  },
]

const raw = [
  {
    slug: 'agrimax-hyflex', sector: 'agriculture', name: 'AGRIMAX HYFLEX', construction: 'Radial', range: 'Agrimax', isNew: true,
    model: '2743281500ff48a8871277ea1471cc98',
    text: 'AGRIMAX HYFLEX has been engineered to deliver outstanding performance across road, field and grassland. Its tread combines efficient road transport with excellent traction, self-cleaning and gentle soil treatment. On the road it offers ride comfort, stable handling, low rolling resistance and a smooth, quiet drive. In the field, VF (Very High Flexion) and PFO (Pressure Field Operation) technologies let it run at very low inflation pressures while keeping a high load capacity, reducing soil compaction and improving traction. On grassland, the rounded tread and shoulder and the larger contact area keep ground pressure low and protect the grass, with reliable traction even on slopes.',
    machines: ['Tractor', 'High-Power Tractor'], applications: ['Transport', 'Soil Tillage'],
    features: ['High Load Capacity', 'Handling & Comfort', 'Self-Cleaning', 'Reduced Soil Compaction', 'Fuel Economy', 'Traction', 'VF Technology'],
    sizes: ['VF 600/70 R 30 SL|STANDARD|168 E|DW 21 B|1592', 'VF 710/70 R 42|STEEL BELTED|182 E|DW 25 B|2045'],
  },
  {
    slug: 'v-fusion', sector: 'agriculture', name: 'V-FUSION', construction: 'Radial', range: '', isNew: true,
    model: '9b85446b19504607b9506a9cf7dcc74d',
    text: 'V-FUSION is a VF implement tyre engineered for the field and the road. Its directional tread pairs overlapping central blocks with multiple contact points for a smooth, quiet, stable ride, low rolling resistance and long wear. In the field, the open centre, rounded elements, lateral gripping edges and shoulder lugs give grassland protection, self-cleaning and easy rolling. VF Technology carries heavy loads at lower inflation pressure, the steel-belted casing adds durability, and its E speed rating allows road travel at up to 70 km/h.',
    machines: ['Trailer'], applications: ['Transport', 'Soil Tillage'],
    features: ['High Load Capacity', 'Low Rolling Resistance', 'Self-Cleaning', 'Strong Casing', 'Reduced Soil Compaction', 'Durability', 'Traction', 'Heavy Duty', 'VF Technology'],
    sizes: ['VF 710/50 R 30.5|STEEL BELTED|178 E, 178 D|AG 24.00|1485'],
  },
  {
    slug: 'agrimax-v-flecto', video: { id: 'WvNABm3B5gY', title: 'BKT Product Videos | Agrimax V-Flecto' }, sector: 'agriculture', name: 'AGRIMAX V-FLECTO', construction: 'Radial', range: 'Agrimax', isNew: false,
    model: 'ed06e4c58afa489199939f14b0606d0d',
    text: 'AGRIMAX V-FLECTO is BKT’s answer to the technology and performance demands of high-power tractors. It is made for soil tillage and haulage, with reduced soil compaction and strong self-cleaning. VF technology lets it carry heavy loads at lower inflation pressure than standard and IF tyres, at high speeds, and the Narrow Rim Option allows it to be mounted on standard rims. Its optimised geometry improves comfort in the field and on the road while reducing fuel consumption.',
    machines: ['Tractor', 'High-Power Tractor'], applications: ['Transport', 'Soil Tillage'],
    features: ['High Load Capacity', 'Handling & Comfort', 'Self-Cleaning', 'Reduced Soil Compaction', 'Fuel Economy', 'Traction'],
    sizes: ['VF 280/70 R 18|STANDARD|116 D|W 9|849', 'VF 340/85 R 28|STANDARD|139 D|W 12|1290', 'VF 480/60 R 28 NRO|STANDARD|145 D|DW 16 L|1290', 'VF 520/60 R 28 NRO|STANDARD|149 D|DW 18 L|1335', 'VF 540/65 R 28 NRO|STANDARD|154 D|DW 20 B|1413', 'VF 600/60 R 28 NRO|STANDARD|163 D|DW 20 B|1440', 'VF 600/60 R 28 NRO|STANDARD|157 D|DW 20 B|1440', 'VF 600/65 R 28 NRO|STANDARD|163 D|DW 21 B|1491', 'VF 600/70 R 28 NRO|STANDARD|167 D|DW 21 B|1551', 'VF 480/70 R 30|STANDARD|153 D|W 18 L|1430', 'VF 540/65 R 30 NRO|STANDARD|158 D|DW 20 B|1464', 'VF 600/60 R 30 NRO|STANDARD|158 D|DW 20 B|1485', 'VF 600/65 R 30|STANDARD|164 E, 164 D|DW 21 B|1530', 'VF 600/70 R 30 NRO|STANDARD|168 D|DW 21 B|1602', 'VF 710/60 R 30|STANDARD|171 D|DW 25 B|1625', 'VF 380/85 R 34|STANDARD|160 E|W 13|1510', 'VF 420/85 R 34|STANDARD|159 E|W 15|1580', 'VF 480/70 R 34 NRO|STANDARD|166 D|W 18 L|1580', 'VF 600/60 R 34|STANDARD|160 D|DW 20 B|1584', 'VF 600/65 R 34 NRO|STANDARD|169 D|DW 21 B|1644', 'VF 600/70 R 34 NRO|STANDARD|170 D|DW 21 B|1704', 'VF 650/60 R 34|STANDARD|168 D|DW 23 B|1676', 'VF 650/65 R 34 NRO|STANDARD|170 D|DW 23 B|1710', 'VF 710/55 R 34|STANDARD|170 D|DW 25 B|1659', 'VF 710/60 R 34 NRO|STANDARD|173 D|DW 25 B|1716', 'VF 480/80 R 38|STANDARD|166 D|DW 16 L|1733', 'VF 520/70 R 38 CFO|SPECIAL|164 D|DW 18 L|1750', 'VF 520/70 R 38|STANDARD|164 D|DW 18 L|1750', 'VF 540/65 R 38 NRO|STANDARD|162 D|DW 20 B|1676', 'VF 600/60 R 38 NRO|STANDARD|168 D|DW 20 B|1685', 'VF 600/60 R 38 NRO|STANDARD|166 D|DW 20 B|1685', 'VF 650/60 R 38 NRO|STANDARD|166 D|DW 23 B|1745', 'VF 650/60 R 38 NRO|STANDARD|173 D|DW 23 B|1745', 'VF 650/65 R 38 NRO|STANDARD|169 D|DW 23 B|1811', 'VF 650/75 R 38 NRO|STANDARD|175 D|DW 23 B|1941', 'VF 650/85 R 38 CFO|SPECIAL|182 D|DW 23 B|2071', 'VF 650/85 R 38|STANDARD|182 D|DW 23 B|2071', 'VF 710/55 R 38|STANDARD|175 D|DW 25 B|1750', 'VF 710/60 R 38 NRO|STANDARD|171 D|DW 25 B|1820', 'VF 710/70 R 38|STANDARD|181 D|DW 24 B|1961', 'VF 710/75 R 38|STANDARD|183 D|DW 24 B|2060', 'VF 800/70 R 38|STANDARD|187 D|DW 28 B|2085', 'VF 800/70 R 38 CFO|SPECIAL|187 D|DW 28 B|2085', 'VF 900/60 R 38 NRO|STANDARD|187 D|DW 30 B|2045', 'VF 480/80 R 42 CFO|SPECIAL|168 D|DW 16 L|1840', 'VF 480/80 R 42|STANDARD|168 D|DW 16 L|1840', 'VF 520/85 R 42|STANDARD|180 D|DW 18 L|1951', 'VF 580/85 R 42 CFO|SPECIAL|183 D|DW 20 B|2058', 'VF 620/70 R 42 CFO|SPECIAL|175 D|DW 21 B|1935', 'VF 620/70 R 42|STANDARD|175 D|DW 21 B|1935', 'VF 650/60 R 42|STANDARD|174 D|DW 23 B|1845', 'VF 650/65 R 42 NRO|STANDARD|174 D|DW 23 B|1913', 'VF 650/75 R 42 CFO|SPECIAL|180 D|DW 23 B|2055', 'VF 650/85 R 42 CFO|SPECIAL|183 D|DW 23 B|2160', 'VF 710/60 R 42 NRO|STANDARD|173 D|DW 25 B|1930', 'VF 710/70 R 42|STEEL BELTED|193 D|DW 25 B|2058', 'VF 710/70 R 42|STANDARD|185 D|DW 25 B|2061', 'VF 710/70 R 42 CFO|STEEL BELTED SPL|193 D|DW 25 B|2058', 'VF 710/70 R 42 CFO|SPECIAL|185 D|DW 25 B|2061', 'VF 710/75 R 42|STANDARD|184 D|DW 24 B|2150', 'VF 900/60 R 42 CFO|SPECIAL|189 D|DW 30 B|2142', 'VF 900/60 R 42 CFO|STEEL BELTED|195 D|DW 30 B|2142', 'VF 900/60 R 42 NRO|STANDARD|189 D|DW 30 B|2142', 'VF 710/60 R 44 NRO|STANDARD|177 E|DW 25 B|1995', 'VF 750/70 R 44|STANDARD|186 D|DW 25 B|2175', 'VF 380/85 R 46|STANDARD|162 E|W 13|1835', 'VF 480/80 R 46 CFO|STEEL BELTED SPL|175 D|DW 16 L|1940', 'VF 520/85 R 46 CFO|SPECIAL|173 D|DW 18 L|2052', 'VF 520/85 R 46|STANDARD|173 D|DW 18 L|2052', 'VF 580/85 R 46 CFO|SPECIAL|179 D|DW 20 B|2156', 'VF 710/60 R 46|STANDARD|174 D|DW 25 B|2041', 'VF 710/60 R 46 CFO|SPECIAL|174 D|DW 25 B|2041', 'VF 710/65 R 46 NRO|STANDARD|188 E|DW 25 B|2090', 'VF 710/65 R 46 NRO|STANDARD|188 D|DW 25 B|2095', 'VF 710/65 R 46 NRO|STEEL BELTED SPECIAL|188 E|DW 25 B|2090', 'VF 900/65 R 46 CFO|SPECIAL|193 D|DW 30 B|2315', 'VF 900/65 R 46 CFO|STEEL BELTED SPL|193 D|DW 30 B|2338', 'VF 900/65 R 46|STEEL BELTED|193 D|DW 30 B|2338', 'VF 900/65 R 46|STANDARD|193 D|DW 30 B|2315', 'VF 480/80 R 50 CFO|STEEL BELTED SPL|179 D|DW 16 L|2038', 'VF 520/85 R 50 CFO|STEEL BELTED SPL|177 D|DW 18 L|2160', 'VF 520/85 R 50|STEEL BELTED|177 D|DW 18 L|2160', 'VF 480/95 R 54|STANDARD|180 E|DW 16 L|2300'],
  },
  {
    slug: 'agrimax-proharvest', video: { id: 'wGFk2CJ_xos', title: 'BKT Knowledge Series | AGRIMAX PROHARVEST' }, sector: 'agriculture', name: 'AGRIMAX PROHARVEST', construction: 'Radial', range: 'Agrimax', isNew: false,
    model: 'f9ce7925078c47d8ba25d37323dccb71',
    text: 'AGRIMAX PROHARVEST is built for combines and harvesting machines. VF (Very High Flexion) technology lets it carry 40% more load than a standard tyre at the same pressure, minimising soil compaction. Three steel belts and a cut- and chip-resistant compound resist punctures from stubble and crop residue, while a reinforced bead and strong polyester carcass keep it stable under heavy duty. CFO (Cyclic Field Operation) technology handles temporary overloads during harvest, and the open shoulder improves traction on rough, wet ground and clears mud on the move — at up to 65 km/h between field and road.',
    machines: ['Harvester'], applications: ['Harvesting'],
    features: ['High Load Capacity', 'Self-Cleaning', 'Cut and Chip Resistance', 'Durability', 'Traction'],
    sizes: ['VF 620/70 R 26 CFO|STEEL BELTED|173 D|DW 21 B|1528', 'VF 800/65 R 32 CFO|STEEL BELTED|187 D|DW 28 B|1853', 'VF 800/70 R 32 CFO|STEEL BELTED|187 D|DW 28 B|1933', 'VF 900/60 R 32 CFO|STEEL BELTED|193 D|DW 30 B|1900', 'VF 1000/55 R 32 CFO|STEEL BELTED|197 D|36.00 VA (multi-piece)|1900', 'VF 1020/55 R 38 CFO|STEEL BELTED|200 D|36.00 VA (multi-piece)|2060'],
  },
  {
    slug: 'agrimax-force', video: { id: 'xuWVzz5VHR4', title: 'BKT Stories | Ranch of Sweden - Sweden' }, sector: 'agriculture', name: 'AGRIMAX FORCE', construction: 'Radial', range: 'Agrimax', isNew: false,
    model: '36c09c29ad34427c8d792220c083e19d',
    text: 'AGRIMAX FORCE, BKT’s high-end radial, is designed for soil tillage, haulage and harvesting with high-power tractors and harvesters. IF technology lets it carry heavy loads at a lower inflation pressure than a standard tyre, reducing soil compaction. A reinforced bead adds strength, and it delivers enhanced traction, strong self-cleaning and fuel economy.',
    machines: ['Tractor', 'High-Power Tractor', 'Harvester'], applications: ['Transport', 'Harvesting', 'Soil Tillage'],
    features: ['High Load Capacity', 'Handling & Comfort', 'Self-Cleaning', 'Reduced Soil Compaction', 'Fuel Economy', 'Traction'],
    sizes: ['IF 600/70 R 28|STANDARD|164 D|DW 21 B|1551', 'IF 710/55 R 28 CFO|STANDARD|165 D|DW 25 B|1493', 'IF 600/70 R 30 CFO|SPECIAL|165 D|DW 21 B ; DW 21 A|1602', 'IF 600/70 R 30 CFO|STANDARD|165 D|DW 21 B ; DW 21 A|1602', 'IF 620/75 R 30 CFO|STANDARD|169 D|DW 23 B|1703', 'IF 710/55 R 30 CFO|STANDARD|166 D|DW 25 B|1544', 'IF 710/60 R 30 CFO|STANDARD|168 D|DW 25 B|1614', 'IF 600/70 R 34|STANDARD|167 D|DW 21 B ; DW 21 A|1704', 'IF 650/60 R 34|STANDARD|165 D|DW 23 B|1644', 'IF 650/65 R 34 CFO|STANDARD|161 D|DW 23 B|1710', 'IF 650/65 R 34 CFO|SPECIAL|161 D|DW 23 B|1710', 'IF 710/55 R 34 CFO|STANDARD|170 D|DW 25 B|1646', 'IF 710/60 R 34 CFO|STANDARD|170 D|DW 25 B|1716', 'IF 710/60 R 34 CFO|SPECIAL|170 D|DW 25 B|1716', 'IF 710/75 R 34 CFO|STANDARD|178 D|DW 25 B|1929', 'IF 380/80 R 38|STANDARD|149 D|W 12|1573', 'IF 420/85 R 38|STANDARD|155 D|DW 14 L|1670', 'IF 650/65 R 38 CFO|STANDARD|169 D|DW 23 B|1830', 'IF 650/75 R 38 CFO|STANDARD|175 D|DW 23 B|1941', 'IF 650/75 R 38 CFO|SPECIAL|175 D|DW 23 B|1941', 'IF 650/85 R 38 CFO|STANDARD|179 D|DW 23 B|2071', 'IF 710/60 R 38|STANDARD|172 D|DW 25 B|1817', 'IF 800/70 R 38 CFO|STANDARD|184 D|DW 27 B|2085', 'IF 900/60 R 38 CFO|STANDARD|184 D|DW 30 A ; DW 30 B|2045', 'IF 650/85 R 42 CFO|STANDARD|180 D|DW 23 B|2173', 'IF 710/70 R 42 CFO|STANDARD|179 D|DW 25 B|2061', 'IF 710/70 R 42 CFO|SPECIAL|179 D|DW 25 B|2061', 'IF 710/75 R 42 CFO|SPECIAL|181 D|DW 25 B|2133', 'IF 710/75 R 42 CFO|STANDARD|181 D|DW 25 B|2133', 'IF 800/70 R 42 CFO|STANDARD|192 D|DW 27 B|2150', 'IF 800/70 R 42 CFO|STANDARD|186 D|DW 27 B|2150', 'IF 900/50 R 42 CFO|STANDARD|180 D|DW 30 B|1955', 'IF 900/60 R 42 CFO|STANDARD|186 D|DW 30 B|2147', 'IF 750/75 R 46 CFO|STANDARD|186 D|DW 25 B|2294', 'IF 480/95 R 50|STANDARD|170 D|DW 16 B|2170'],
  },
  {
    slug: 'xl-grip-l3', sector: 'otr', name: 'XL GRIP (L3)', construction: 'Bias', range: '', isNew: false,
    model: 'a66a95dd75c44bdc9714187cc58de746',
    text: 'XL GRIP (E-3/L-3) is a wide-base bias-ply tyre for loaders, designed to minimise cuts and punctures in heavy-duty loading. It provides exceptional traction and an extended tyre life.',
    machines: ['Loader', 'Dozer'], applications: ['Construction', 'Loading', 'Dozing'],
    features: ['Traction', 'Heavy Duty', 'Durability', 'Cut Resistance', 'Stability'],
    sizes: ['16.0/70 - 20|STANDARD||13 SDC|1090', '15.5 - 25|STANDARD||12.00/1.3|1285', '17.5 - 25|DUAL BEAD||14.00/1.5|1345', '17.5 - 25|STANDARD||14.00/1.5|1345', '20.5 - 25|STANDARD||17.00/2.0|1485', '23.5 - 25|STANDARD||19.50/2.5|1625', '23.5 - 25|ARAMID BELTED HD||19.50/2.5|1625', '26.5 - 25|STANDARD||22.00/3.0|1740', '29.5 - 25|STANDARD||25.00/3.5|1860'],
  },
  {
    slug: 'xl-grip-bhl', sector: 'otr', name: 'XL GRIP (BHL)', construction: 'Bias', range: '', isNew: false,
    model: '2a7745201324483f9f061db35aa37b36',
    text: 'XL GRIP is designed for backhoe loaders in heavy-duty excavation, dozing and loading. The non-directional tread gives strong traction and stability, and a special compound delivers excellent cut and chip resistance and a longer tread life.',
    machines: ['Backhoe Loader'], applications: ['Loading', 'Dozing'],
    features: ['Durability', 'Cut Resistance', 'Stability'],
    sizes: ['9.00 - 16|STANDARD|132 A6|6.50 H|910', '9.00 - 16|STANDARD|137 A6|6.50 H|910', '12.5/80 - 18|STANDARD||W 9|980', '10.00 - 20|ARAMID BELTED||7.5|1075', '10.00 - 20|INDUSTRIAL||7.5|1075', '10.00 - 20|STEEL BELTED||7.5|1075', '10.00 - 20|ARAMID + STEEL BELTED||7.5|1075', '12.00 - 20|INDUSTRIAL||8.5|1155', '12.00 - 24|INDUSTRIAL||8.5|1250', '14.9 - 24|INDUSTRIAL|145 A8|DW 13|1240', '16.9 - 28|INDUSTRIAL|152 A8|DW 15L|1400'],
  },
  {
    slug: 'tr-463', sector: 'otr', name: 'TR 463', construction: 'Bias', range: '', isNew: false,
    model: 'd45f0562f4d4447c8649934eeed1cd40',
    text: 'TR 463 is designed for backhoe loaders and industrial tractors. A superior tread compound and strong nylon casing make it a dependable choice for industrial and OTR work and construction sites, with excellent traction on the drive wheels.',
    machines: ['Backhoe Loader', 'Industrial Tractor'], applications: ['Industrial Handling'],
    features: ['Traction'],
    sizes: ['16.9 - 24|INDUSTRIAL|152 A8|DW 15 L|1300', '16.9 - 24|INDUSTRIAL|149 A8|DW 15 L|1300', '18.4 - 26|INDUSTRIAL|156 A8|DW 16 L|1425', '18.4 - 26|INDUSTRIAL|158 A8|DW 16 L|1425', '16.9 - 28|INDUSTRIAL|152 A8|DW 15 L|1405'],
  },
  {
    slug: 'bk-loader-53', sector: 'otr', name: 'BK-LOADER 53', construction: 'Radial', range: '', isNew: false,
    model: 'a2d501c8dbfa4b32ab8d8a8ef3ebbc7e',
    text: 'BK-LOADER 53 is an aramid-belted tyre for loaders in industrial work. Its tread gives strong lateral stability and long wear, and the extra-deep tread resists cuts and punctures. It self-cleans well and grips on wet and dry surfaces, which makes it particularly suited to recycling operations.',
    machines: ['Loader'], applications: ['Transport', 'Waste Management'],
    features: ['Traction', 'Cut and Chip Resistance', 'Self-Cleaning', 'High Puncture Resistance'],
    sizes: ['365/70 R 18|ARAMID BELTED|146A2/142A4|11|990', '405/70 R 18|ARAMID BELTED|153A2/149A4|13|1045', '405/70 R 20|ARAMID BELTED|155A2/151A4|13|1097'],
  },
  {
    slug: 'pac-master', sector: 'otr', name: 'PAC MASTER', construction: 'Bias', range: '', isNew: false,
    model: '436467ee0d434ec4ab5214f0edc6e3c5',
    text: 'PAC MASTER is a bias tyre for compactors. It is highly stable, lasts long, and uses a special compound with particular heat resistance.',
    machines: ['Compactor'], applications: ['Compacting'],
    features: ['Heat Resistance', 'Durability', 'Stability'],
    sizes: ['7.50 - 15|STANDARD||6.0|790', '8.5/90 - 15 K|STANDARD||6.0|785', '9.5/65 - 15|STANDARD||7.0|675', '190/60 - 15|STANDARD||6.0|610', '205/60 - 15|STANDARD||6.0 J|640', '7.50 - 16|STANDARD||6.0|815', '10.5/80 - 16|STANDARD||8.0|810', '9.00 - 20|STANDARD||7.0|1016', '11.00 - 20|SPECIAL||8.0|1070', '14/70 - 20|STANDARD||11 TG|975'],
  },
  {
    slug: 'desert-king', sector: 'otr', name: 'DESERT KING', construction: 'Bias', range: '', isNew: false,
    model: 'bb4a1226426140ed9c8cd75498de4702',
    text: 'DESERT KING is made for loose soil, sandy terrain and paver work with desert trucks. Its rib tread gives excellent flotation and directional stability, and the strong nylon casing and heavy-duty bead are built for low-pressure running. It also resists punctures and lasts longer.',
    machines: ['Desert Truck'], applications: ['Sandy Terrain', 'Loose Soil'],
    features: ['Excellent Flotation', 'Stability', 'Durability', 'High Puncture Resistance'],
    sizes: ['18.00 - 25 DT|STANDARD||10.00/1.5|1535', '21.00 - 25 DT|STANDARD||15.00/3.0|1660', '29.5 - 25 DT|STANDARD||25.00/3.5|1822'],
  },
  {
    slug: 'earthmax-sr-31', sector: 'otr', name: 'EARTHMAX SR 31', construction: 'Radial', range: 'Earthmax', isNew: false,
    model: '048663de96064da9b31ff8ceb7dd23d5',
    text: 'EARTHMAX SR 31 is an all-steel radial tyre for articulated dump trucks and wheel loaders. It is exceptionally strong and stable, and its non-directional rigid block pattern gives traction and manoeuvrability even on muddy ground. A cut- and heat-resistant compound adds durability, and the radial casing lowers rolling resistance for real fuel savings.',
    machines: ['Loader', 'Dozer', 'Articulated Dump Truck'], applications: ['Transport', 'Loading', 'Dozing'],
    features: ['Comfort', 'Traction', 'Stability', 'Cut Resistance', 'Durability'],
    sizes: ['20.5 R 25|CUT RESISTANT COMPOUND|177 B, 186 A2|17.00/2.0|1480', '23.5 R 25|CUT RESISTANT COMPOUND|185 B, 195 A2|19.50/2.5|1607', '26.5 R 25|CUT RESISTANT COMPOUND|193 B, 202 A2|22.00/3.0|1742', '26.5 R 25|CUT RESISTANT COMPOUND|209 A2|22.00/3.0|1742', '29.5 R 25|CUT RESISTANT COMPOUND|200 B, 208 A2|25.00/3.5|1861', '29.5 R 25|CUT RESISTANT COMPOUND|216 A2|25.00/3.5|1861'],
  },
  {
    slug: 'earthmax-sr-41', video: { id: '7fxmEK35qK8', title: 'BKT Product Videos | EARTHMAX SR 41' }, sector: 'otr', name: 'EARTHMAX SR 41', construction: 'Radial', range: 'Earthmax', isNew: false,
    model: '66ae8f9f87cb455aab394827476cc538',
    text: 'EARTHMAX SR 41 is an all-steel radial tyre for articulated dump trucks, loaders and dozers. Its all-steel structure and block pattern resist punctures and extend service life, with long working hours, little downtime and real operator comfort. It is also available in E4**** for low-profile dump trucks in underground haulage.',
    machines: ['Loader', 'Dozer', 'Low Profile Dump Truck', 'Articulated Dump Truck'], applications: ['Transport', 'Loading', 'Dozing'],
    features: ['Comfort', 'Traction', 'Cut Resistance', 'Durability'],
    sizes: ['23.5 R 25|CUT RESISTANT COMPOUND|185 B, 195 A2|19.50/2.5|1611', '26.5 R 25|STANDARD|193 B|22.00/3.0|1742', '26.5 R 25|CUT RESISTANT COMPOUND||22.00/3.0|1742', '26.5 R 25|CUT RESISTANT COMPOUND|193 B, 202 A2|22.00/3.0|1742', '29.5 R 25|CUT RESISTANT COMPOUND|200 B|25.00/3.5|1861', '29.5 R 25|STANDARD|200 B|25.00/3.5|1861', '29.5 R 25|CUT RESISTANT COMPOUND||25.00/3.5|1861', '29.5 R 25|CUT RESISTANT COMPOUND|221 A2|25.00/3.5|1861', '29.5 R 25|CUT RESISTANT COMPOUND|200 B, 208 A2|25.00/3.5|1862', '875/65 R 29 (35/65 R 29)|CUT RESISTANT COMPOUND|221 A2|27.00/3.5|1865', '875/65 R 29 (35/65 R 29)|CUT RESISTANT COMPOUND|203 B|27.00/3.50|1865', '875/65 R 29 (35/65 R 29)|CUT RESISTANT COMPOUND|203 B, 214 A2|27.00/3.50|1865', '875/65 R 29 (35/65 R 29)|CUT RESISTANT COMPOUND|214 A2|27.00/3.50|1865', '35/65 R 33|CUT RESISTANT COMPOUND||28.00/3.5|2063'],
  },
  {
    slug: 'earthmax-sr-44', sector: 'otr', name: 'EARTHMAX SR 44', construction: 'Radial', range: 'Earthmax', isNew: false,
    model: '65dee570ba784a1baca12cb9bb9dcf23',
    text: 'EARTHMAX SR 44 (E-4) is an all-steel radial tyre for transport work with tippers. Its rugged E-4 tread gives excellent traction and operator comfort, with a high load capacity and exceptional durability.',
    machines: ['On/Off Truck'], applications: ['Transport'],
    features: ['Comfort', 'Traction', 'Durability', 'Heat Resistance'],
    sizes: ['7.50 R 16|STANDARD|122/118 G|6|820', '10.00 R 20|STANDARD|146/143 G|7.50|1075', '11.00 R 20|STANDARD||8.00|1111', '12.00 R 20|STANDARD||8.50V|1138', '12.00 R 24 (325/95 R 24)|STANDARD|158 B|8.50V|1250'],
  },
  {
    slug: 'earthmax-sr-45-m', video: { id: 'VV70CemqfZs', title: 'BKT Product Videos | EARTHMAX SR 45 M' }, sector: 'otr', name: 'EARTHMAX SR 45 M', construction: 'Radial', range: 'Earthmax', isNew: false,
    model: '714553546d334b10a10e8a1c5e6486b7',
    text: 'EARTHMAX SR 45 M is an all-steel radial tyre designed for rigid haul trucks. It provides optimum traction and is ideal for long hauls.',
    machines: ['Rigid Dump Truck'], applications: ['Transport', 'Surface Mining'],
    features: ['Traction', 'Cut Resistance', 'High Puncture Resistance'],
    sizes: ['18.00 R 33|CUT RESISTANT COMPOUND|195 B|13.00/2.5|1870', '18.00 R 33|HEAT RESISTANT COMPOUND|191 B|13.00/2.5|1870', '18.00 R 33|CUT RESISTANT COMPOUND|191 B|13.00/2.5|1870', '18.00 R 33|STANDARD|191 B|13.00/2.5|1870', '18.00 R 33|STANDARD|195 B|13.00/2.5|1870', '21.00 R 33|CUT RESISTANT COMPOUND|200 B|15.00/3.0|2001', '24.00 R 35|STANDARD|209 B|17.00/3.5|2180', '24.00 R 35|HEAT RESISTANT COMPOUND|209 B|17.00/3.5|2180', '24.00 R 35|CUT RESISTANT COMPOUND|209 B|17.00/3.5|2180'],
  },
]

const ranges = [
  { sector: 'otr', data: otrRange },
  { sector: 'agriculture', data: agriRange },
]

/* Machine groups from both PDFs (e.g. "Tipper", "Tractor rear"), for the
   "Stocked in Nepal" line on tyre pages. */
export const rangeGroups = ranges.flatMap(({ data }) =>
  Object.entries(data.groups).map(([id, name]) => ({ id, name })),
)

/* slug → { sector, groups, stock } from whichever PDF lists it */
const pdfBySlug = {}
for (const { sector, data } of ranges) for (const p of data.products) pdfBySlug[p.slug] = { ...p, pdfSector: sector }

/* PDF patterns not already featured above join under their PDF's sector. */
const existing = new Set(raw.map((p) => p.slug))
const rangeRaw = ranges.flatMap(({ sector, data }) =>
  data.products
    .filter((p) => !existing.has(p.slug))
    .map(({ img: _img, sizesFiltered: _f, ...p }) => ({ ...p, sector })),
)

export const products = [...raw, ...rangeRaw].map((p) => {
  const pdf = pdfBySlug[p.slug]
  /* a tyre in a PDF also appears under that PDF's sector, whatever its home */
  const inSectors = pdf && p.sector !== pdf.pdfSector ? [p.sector, pdf.pdfSector] : [p.sector]
  const sizes = p.sizes.map((s) => {
    const [size, version, load, rim, od] = s.split('|')
    return { size, version, load, rim, od }
  })
  return {
    ...p,
    image: imageFor(p.slug),
    thumb: thumbFor(p.slug),
    summary: p.text.split(/(?<=\.)\s/)[0],
    sizes,
    /* distinct nominal sizes, for the "N sizes" count on cards */
    sizeCount: new Set(sizes.map((s) => s.size)).size,
    sectorName: sectors.find((s) => s.id === p.sector).name,
    sectors: inSectors,
    groups: pdf ? pdf.groups : [],
    stock: pdf ? pdf.stock : [],
  }
})

export const productBySlug = (slug) => products.find((p) => p.slug === slug)
export const productsIn = (sector) => products.filter((p) => p.sectors.includes(sector))

/* Up to `n` other tyres for the same job: same machine group first, then the
   rest of the sector. */
export const relatedTo = (p, n = 4) => {
  const pool = products.filter((x) => x.slug !== p.slug && x.sectors.some((s) => p.sectors.includes(s)))
  const same = pool.filter((x) => x.groups.some((g) => p.groups.includes(g)))
  return [...same, ...pool.filter((x) => !same.includes(x))].slice(0, n)
}

export const sketchfabSrc = (id) =>
  `https://sketchfab.com/models/${id}/embed?autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_hint=0&ui_animations=0`

