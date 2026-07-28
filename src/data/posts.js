import tractorField from '../assets/tractor-field.webp'
import tyreDetail from '../assets/tyre-detail.webp'
import bktTruck from '../assets/bkt-truck.webp'
import bktBanner from '../assets/bkt-banner.webp'

/* ASSET NOTE — the folder has only four distinct photographs; several filenames
 * are duplicates of the same shot (tyre-detail.webp = 13760_z…jpeg,
 * bkt-truck.webp = BKT-TRUCK-PICTURE.jpg, tractor-field.webp = WhatsApp-…-4.jpeg):
 *
 *   tractorField — John Deere 6M on BKT Flotation 648, flowering meadow
 *   tyreDetail   — Agrimax sidewall close-up, e-ready badge, implement behind
 *   bktTruck     — BKT-liveried Monster Jam display truck, event car park
 *   bktBanner    — a BKT MARKETING BANNER (logo, tagline, five composited
 *                  product tyres). Not a photograph of tyres at work; only use
 *                  it where an advertisement is what's wanted.
 *
 * Three posts therefore share an image with another post. Fix by getting more
 * client photography, not by re-labelling what these pictures show.
 */

/* Journal content.
 *
 * PLACEHOLDER COPY: every article below is written generically about tyres —
 * load indices, compaction, sidewall markings — so nothing is claimed on the
 * client's behalf. Swap for signed-off editorial when it lands.
 *
 * Shape: `slug` drives the /blog/:slug route, so keep it URL-safe and stable —
 * changing one breaks any link already shared. `body` is an ordered list of
 * blocks; BlogPost.jsx renders 'p' | 'h' | 'quote' and ignores anything else.
 * Newest first — Blog.jsx takes posts[0] as the lead and does not sort.
 */
export const ISSUE = { no: '04', season: 'Monsoon 2026' }

export const posts = [
  {
    slug: 'choosing-the-right-tractor-tyre',
    title: 'Choosing the right tyre for your tractor',
    category: 'Guides',
    date: '18 July 2026',
    read: '5 min',
    img: tractorField,
    alt: 'A John Deere 6M tractor standing in a flowering meadow on BKT Flotation 648 tyres',
    excerpt:
      'Load, terrain and ground pressure all decide the answer. A working method for matching a tyre to the job rather than to the last set you bought.',
    body: [
      {
        type: 'p',
        text: 'Start with the axle load, not the rim. Every tyre carries a load index and a speed symbol on its sidewall, and those two numbers set the ceiling for what it can safely carry at a given pressure. Weigh the machine as it actually works — loader full, tank full, implement mounted — and size from that figure, never from the bare tractor.',
      },
      {
        type: 'p',
        text: 'This is where most bad fitments begin. A tyre chosen for the tractor as it left the dealership will be marginal the day a front loader goes on, and marginal tyres do not fail politely: they run hot, they wear from the inside, and they give up under exactly the load that put them there.',
      },
      { type: 'h', text: 'Then read the ground' },
      {
        type: 'p',
        text: 'Tilled soil rewards a taller, more flexible casing run at low pressure. The footprint lengthens, the lugs bite, and the load spreads instead of concentrating. Hard surfaces and road transport want the opposite — higher pressure, a stiffer casing, and a tread that will not scrub itself away on tarmac between fields.',
      },
      {
        type: 'p',
        text: 'Most machines do both, which means the honest answer is a compromise weighted toward wherever the hours actually go. Count the hours before you choose the tread. If eight in ten are on soil, buy for soil and accept slightly faster road wear; if the tractor lives on a road between plots, stop buying a field tyre and wondering why it lasts a season.',
      },
      {
        type: 'quote',
        text: 'A tyre is sized by the heaviest thing it will carry, not by the machine it arrived on.',
      },
      { type: 'h', text: 'Match the pair' },
      {
        type: 'p',
        text: 'Front and rear tyres on a mechanical four-wheel-drive tractor must keep their designed rolling-circumference ratio, or the drivetrain fights itself and wears from the inside out. If you change one axle, check the other before you order — the correct ratio is in the operator manual, and confirming it takes a minute against the years it can cost.',
      },
      {
        type: 'p',
        text: 'When the numbers are settled, the rest is straightforward: check the rim width is approved for the section width, confirm clearance at full lock and full articulation, and set the inflation pressure from the manufacturer load table rather than from habit. Get those three right and the tyre will do exactly what it was built to do.',
      },
    ],
  },
  {
    slug: 'why-flotation-tyres-protect-soil',
    title: 'Why flotation tyres protect your soil',
    category: 'Agriculture',
    date: '02 July 2026',
    read: '4 min',
    img: bktBanner,
    alt: 'A BKT advertisement showing five Agrimax agricultural tyres on a road between vineyards',
    excerpt:
      'A wider footprint spreads the same weight over more ground. That single fact is what keeps a field productive season after season.',
    body: [
      {
        type: 'p',
        text: 'Compaction is a pressure problem, not a weight problem. The same machine will damage soil badly on narrow tyres at high pressure and barely mark it on wide tyres at low pressure, because what the ground feels is force divided by contact area. Widen the contact area and the pressure at the root zone falls away.',
      },
      {
        type: 'p',
        text: 'That distinction matters because weight is the part nobody can reduce. Machines have grown heavier every decade and will keep doing so. The only variable still genuinely in your hands is how that weight is delivered to the ground.',
      },
      { type: 'h', text: 'The damage you cannot see' },
      {
        type: 'p',
        text: 'Surface ruts can be worked out. A compacted layer below tillage depth cannot — it restricts rooting, holds water where roots drown, and can take years of freeze, root growth and deep loosening to recover. All of it costs yield quietly, in a way no single season makes obvious.',
      },
      {
        type: 'quote',
        text: 'Ruts are an inconvenience. Subsoil compaction is a decade-long bill.',
      },
      {
        type: 'p',
        text: 'Flotation and improved-flexion casings exist to buy back contact area. They are built to run safely at lower inflation pressures for the same load, which is the entire point: the tyre deflects, the footprint lengthens, and the field carries the machine rather than being reshaped by it.',
      },
      { type: 'h', text: 'Getting the benefit in practice' },
      {
        type: 'p',
        text: 'A flotation tyre run at road pressure is just an expensive ordinary tyre. The gain only arrives if the pressure is actually dropped to the figure the load table allows, which means checking pressures against the real axle load and adjusting when the job changes — light harrowing and a full grain trailer are not the same duty.',
      },
      {
        type: 'p',
        text: 'Where the machine crosses hard ground on the same set, plan the compromise deliberately: keep transport speeds down at field pressure, or fit a system that lets you change pressure on the move. Either is cheaper than repairing a soil profile.',
      },
    ],
  },
  {
    slug: 'what-e-ready-means',
    title: 'What “e-ready” actually means for a tyre',
    category: 'Innovation',
    date: '11 June 2026',
    read: '6 min',
    img: tyreDetail,
    alt: 'Close detail of a BKT Agrimax sidewall carrying the e-ready badge, with a field implement behind it',
    excerpt:
      'Electric and autonomous machinery changes the loads a tyre sees. Here is what the label on the sidewall is really describing.',
    body: [
      {
        type: 'p',
        text: 'Battery packs are heavy and they sit low. An electric machine in the same working class as a diesel one is often heavier, with its mass distributed differently, so the tyre is asked to carry more at the same size — which pushes the required load index up before anything else is considered.',
      },
      {
        type: 'p',
        text: 'That is the unglamorous core of the label. Before any talk of compounds or acoustics, an e-ready tyre is one specified for a machine that weighs more than its predecessor and distributes that weight less conventionally.',
      },
      { type: 'h', text: 'Torque from a standstill' },
      {
        type: 'p',
        text: 'Electric drive delivers full torque instantly and from rest. That is a shear load on the tread blocks and the casing, and it punishes a compound tuned for the gentler build-up of a diesel powertrain. An e-ready tyre answers it with construction and compound, not with marketing.',
      },
      {
        type: 'quote',
        text: 'Take the engine away and the tyre becomes the loudest part of the machine.',
      },
      { type: 'h', text: 'The quieter requirement' },
      {
        type: 'p',
        text: 'Noise moves up the brief. With no engine to mask it, tread pattern acoustics become something an operator notices all day, so pitch sequencing and block geometry start carrying an acoustic job alongside grip and wear — three requirements that pull against each other and have to be balanced rather than won.',
      },
      {
        type: 'p',
        text: 'Autonomy adds one more: predictability over long unattended shifts. A machine with nobody in the seat cannot report a soft tyre or a change in handling, so consistency of pressure retention and wear matters more than a marginal gain in peak grip.',
      },
      {
        type: 'p',
        text: 'None of this is exotic. It is ordinary tyre engineering responding to a different duty cycle — which is exactly what you should expect the label to mean, and what to ask a supplier to evidence when they use it.',
      },
    ],
  },
  {
    slug: 'getting-the-most-mileage',
    title: 'Getting the most mileage out of a set',
    category: 'Maintenance',
    date: '24 May 2026',
    read: '3 min',
    img: tyreDetail,
    alt: 'Close detail of a BKT Agrimax tyre sidewall, showing the tread shoulder and moulded markings',
    excerpt:
      'Pressure, alignment, rotation, storage. Four unglamorous habits that decide whether a set lasts its rated life or half of it.',
    body: [
      {
        type: 'p',
        text: 'Check pressure cold and check it often. A tyre run ten per cent under pressure flexes more than it was designed to, runs hotter, and wears its shoulders while the centre stays fat — and by the time that pattern is visible on the tread, the mileage is already spent.',
      },
      {
        type: 'p',
        text: 'Cold matters. A tyre checked warm reads high, you bleed air out to correct it, and the tyre is then genuinely under-inflated once it cools. More sets are ruined by well-intentioned warm checks than by neglect.',
      },
      { type: 'h', text: 'Geometry and position' },
      {
        type: 'p',
        text: 'Uneven wear across a set is nearly always geometry or position rather than the tyre itself. Rotate on a schedule, and treat a one-sided wear pattern as a symptom to diagnose — a fitter replacing the tyre without correcting the alignment has sold you the same problem twice.',
      },
      {
        type: 'quote',
        text: 'Uneven wear is a message. Replacing the tyre without reading it just buys the message again.',
      },
      { type: 'h', text: 'Storage counts' },
      {
        type: 'p',
        text: 'Rubber ages under ultraviolet light, ozone and heat whether it is turning or not. A spare set kept upright, cool, dry and out of direct sun will still be a usable set when you need it. Stacked in a hot yard against a wall, it will not be.',
      },
      {
        type: 'p',
        text: 'None of these habits are interesting, and that is rather the point. The difference between a set that reaches its rated life and one that gives up halfway is almost never a dramatic failure — it is four small routines, kept or not kept.',
      },
    ],
  },
  {
    slug: 'reading-a-sidewall',
    title: 'Reading a sidewall without guessing',
    category: 'Guides',
    date: '09 April 2026',
    read: '4 min',
    img: bktTruck,
    alt: 'The sidewall lettering on a BKT-liveried monster truck at a Monster Jam event',
    excerpt:
      'Width, aspect ratio, construction, rim, load index, speed symbol. Six values, in a fixed order, on every tyre you own.',
    body: [
      {
        type: 'p',
        text: 'The marking is a sentence with a fixed grammar. In 480/70 R 34 143 A8, the 480 is the nominal section width in millimetres, the 70 is the aspect ratio as a percentage of that width, the R means radial construction, and the 34 is the rim diameter in inches.',
      },
      {
        type: 'p',
        text: 'Read in that order it stops being a code. Width, then how tall the sidewall is relative to it, then how the casing is built, then what rim it belongs on — four facts that between them describe the shape of the tyre exactly.',
      },
      { type: 'h', text: 'The pair at the end' },
      {
        type: 'p',
        text: 'The two values everyone skips matter most. The load index is a coded maximum load per tyre at a stated pressure; the speed symbol is the maximum speed at which that load applies. Fitting a lower index than the machine requires is not a preference or a saving — it is an overload, and it is the fitter as much as the owner who carries that.',
      },
      {
        type: 'quote',
        text: 'The load index is not a recommendation. It is a ceiling with your machine sitting under it.',
      },
      { type: 'h', text: 'Everything else is traceability' },
      {
        type: 'p',
        text: 'The rest of the sidewall records the manufacturing week and year, the plant, and the standards the tyre was approved against. Read it once when the tyre arrives, note it with the invoice, and you will know exactly what you fitted when a question comes up three years later.',
      },
      {
        type: 'p',
        text: 'That habit is also your best defence against counterfeit stock. A tyre whose markings are incomplete, inconsistent or unreadable is telling you something before it has turned a single revolution.',
      },
    ],
  },
  {
    slug: 'preparing-a-fleet-for-monsoon',
    title: 'Preparing a fleet for monsoon season',
    category: 'Industry',
    date: '21 February 2026',
    read: '5 min',
    img: bktTruck,
    alt: 'A BKT-liveried monster truck on display at a Monster Jam event',
    excerpt:
      'Wet traction is a drainage problem. What to inspect before the rains, and what to stop tolerating once they start.',
    body: [
      {
        type: 'p',
        text: 'Tread depth is a drainage measurement. Grooves exist to move water out from under the contact patch, and as they shallow, the volume they can clear falls — which is why a half-worn tyre that feels fine in the dry can lose grip suddenly on standing water.',
      },
      {
        type: 'p',
        text: 'The loss is not gradual in the way wear is. Grip holds, then goes, and it goes at the speed and water depth where the remaining grooves stop keeping up. That threshold moves closer every millimetre the tread wears down.',
      },
      { type: 'h', text: 'Inspect before, not during' },
      {
        type: 'p',
        text: 'Cuts, exposed cords, bead damage and slow leaks are all far cheaper to find in a yard than on a wet highway with a loaded trailer behind them. A documented pre-season inspection also gives you a baseline: without one, you cannot tell a new problem from one that has been developing for a year.',
      },
      {
        type: 'quote',
        text: 'Every wet-season failure was visible in the yard, if anyone had looked.',
      },
      { type: 'h', text: 'Then change how it is driven' },
      {
        type: 'p',
        text: 'Lower speeds on standing water, longer following distances, and drivers who report a change in handling the day it happens will do more for wet-season safety than any single product decision. The tyre sets the ceiling; the driving decides how close you run to it.',
      },
      {
        type: 'p',
        text: 'Make reporting easy and consequence-free, or it will not happen. A driver who expects to be blamed for a soft tyre will keep quiet about it until the day it stops being a soft tyre.',
      },
    ],
  },
]

export const topics = ['All', 'Guides', 'Agriculture', 'Innovation', 'Maintenance', 'Industry']

export const getPost = (slug) => posts.find((p) => p.slug === slug)

/* Neighbours for the article footer. Wraps, so the last story leads back to the
   first rather than dead-ending. */
export const getNeighbours = (slug) => {
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: posts[(i - 1 + posts.length) % posts.length],
    next: posts[(i + 1) % posts.length],
  }
}
