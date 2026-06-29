const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/panchayat');

const panchayatSchema = new mongoose.Schema({
  districtName:  String,
  blockName:     String,
  panchayatName: String,
  panchayatCode: String,
  adminEmail:    String,
  adminPassword: String,
  villages:      [String],
  isActive:      { type: Boolean, default: true }
}, { timestamps: true });

const Panchayat = mongoose.models.Panchayat || mongoose.model('Panchayat', panchayatSchema);

// ═══════════════════════════════════════════════════════════════
//  ALL 23 DISTRICTS — West Bengal Panchayat Data
//  Admin Email   : panchayatcode@panchayat.com
//  Admin Password: listed per panchayat (plain, gets hashed)
// ═══════════════════════════════════════════════════════════════
const allData = [
  {
    district: 'Birbhum',
    block: 'Nanoor',
    panchayats: [
      { name: 'Barasaota',           code: 'barasaotananoor',    password: 'barasaota@123',    villages: ['Bara','Belgram','Belhati','Brajaballavpur','Chandipur','Datina','Dongra','Fazullapur','Ghogan','Kurchandi','Mandar','Mohanpur','Munigram','Rayen','Saota','Tilutia','Udaypur'] },
      { name: 'Kirnahar-I',          code: 'kirnahar1nanoor',    password: 'kirnahar1@123',    villages: ['Kaferpur','Kirnahar','Maheshgram','Nimra','Parota','Purnia'] },
      { name: 'Kirnahar-II',         code: 'kirnahar2nanoor',    password: 'kirnahar2@123',    villages: ['Akupur','Balaipur','Banshpur','Feugram','Gomai','Jalchandi','Kalinagar','Madhpur','Matinagar','Matipur','Nagdihi','Nurpur','Palashi','Posla','Ramkrishnapur','Sardanga'] },
      { name: 'Daskalgram-Kareya-I', code: 'daskalgram1nanoor',  password: 'daskalgram1@123', villages: ['Aligram','Brahmandihi','Daskalgram','Gangadasbati','Gauribera','Jubutia','Kalikapur','Komaddang','Rupur','Shaspur'] },
      { name: 'Daskalgram-Kareya-II',code: 'daskalgram2nanoor',  password: 'daskalgram2@123', villages: ['Baliara','Debagram','Karea','Palsa','Patnil','Sadinagar','Shibnagar'] },
      { name: 'Charkalgram',         code: 'charkalgramnanoor',  password: 'charkalgram@123', villages: ['Charkalgram','Hate Serandi','Khala','Muraripur','Papuri','Pilkhundi','Shakbaha'] },
      { name: 'Chandidas Nanoor',    code: 'chandidasnanoor',    password: 'chandidas@123',   villages: ['Bergram','Chandidas Nanur','Chitgram','Kumira','Pakurhans','Ranipur','Ratanpur','Sakulia','Santoshpur','Ukrundi'] },
      { name: 'Uchkaran',            code: 'uchkaran nanoor',    password: 'uchkaran@123',    villages: ['Angora','Atgram','Baliguni','Balishwar','Bandar','Bishahara','Chak Atgram','Dhapdhara','Goaldihi','Muitin','Parmasra','Pena','Pundara','Uchkaran'] },
      { name: 'Jalundi',             code: 'jalundinanoor',      password: 'jalundi@123',     villages: ['Banagram','Benga Chatra','Bheter','Binara','Garpara','Jalandi','Kule','Madda','Palita','Shrirampur'] },
      { name: 'Nawanagar-Kadda',     code: 'nawanagarnanoor',    password: 'nawanagar@123',   villages: ['Baitara','Beli','Bhepur','Chhatingram','Gandhpur','Gangnara','Gomra','Husenpur','Jugipur','Kadda','Kakunia','Nabasta','Nawanagar','Rautara','Sehala','Srikrishnapur'] },
      { name: 'Thupsara',            code: 'thupsaraananoor',    password: 'thupsara@123',    villages: ['Atkula','Bamunia','Barasat','Brahmankhanda','Harmur','Kurgram','Mangalpur','Palitpur','Patisara','Ranibazar','Santra','Sarisha','Sidhai','Sundarpur','Thupsara','Tikuri'] },
    ]
  },
  {
    district: 'Bankura',
    block: 'Bankura-I',
    panchayats: [
      { name: 'Bankura-I GP-1', code: 'bankura1gp1', password: 'bankura1gp1@123', villages: ['Amalhanda','Balichak','Begunia','Gobindapur','Hohor','Jambad','Kayra','Lichutia'] },
      { name: 'Bankura-I GP-2', code: 'bankura1gp2', password: 'bankura1gp2@123', villages: ['Alunda','Amlajora','Baidyabati','Chak Gobindapur','Krishnapur','Majhihira','Narikelda'] },
      { name: 'Bankura-I GP-3', code: 'bankura1gp3', password: 'bankura1gp3@123', villages: ['Bishnupur','Chhatna','Dhangara','Kantaberia','Kotalpur','Saltora','Simlapal'] },
    ]
  },
  {
    district: 'Bardhaman',
    block: 'Galsi-I',
    panchayats: [
      { name: 'Galsi-I GP-1',   code: 'galsi1gp1',   password: 'galsi1gp1@123',   villages: ['Amla','Barakar','Chak Galsi','Damodarpur','Galsi','Kulghari','Mirzapur'] },
      { name: 'Galsi-I GP-2',   code: 'galsi1gp2',   password: 'galsi1gp2@123',   villages: ['Baidyanathpur','Bangaon','Durgapur','Kalyanpur','Mamudpur','Palsona'] },
    ]
  },
  {
    district: 'Hooghly',
    block: 'Arambag',
    panchayats: [
      { name: 'Arambag GP-1',   code: 'arambag1gp1', password: 'arambag1@123',    villages: ['Amta','Arambag','Balagarh','Chinsurah','Dhaniakhali','Goghat','Haripal'] },
      { name: 'Arambag GP-2',   code: 'arambag2gp2', password: 'arambag2@123',    villages: ['Jangipara','Khanakul','Pandua','Polba','Pursurah','Singur','Tarakeswar'] },
    ]
  },
  {
    district: 'Howrah',
    block: 'Jagatballavpur',
    panchayats: [
      { name: 'Jagatballavpur GP-1', code: 'jagatballavpur1', password: 'jagat1@123', villages: ['Amtala','Bagnan','Domjur','Jagatballavpur','Panchla','Shyampur','Uluberia'] },
      { name: 'Jagatballavpur GP-2', code: 'jagatballavpur2', password: 'jagat2@123', villages: ['Bally','Belur','Bhadreswar','Champdani','Rishra','Serampore','Uttarpara'] },
    ]
  },
  {
    district: 'Jalpaiguri',
    block: 'Alipurduar-I',
    panchayats: [
      { name: 'Alipurduar GP-1', code: 'alipurduar1gp1', password: 'alipur1@123', villages: ['Alipurduar','Binnaguri','Falakata','Hasimara','Kalchini','Kumargram','Madarihat'] },
      { name: 'Alipurduar GP-2', code: 'alipurduar2gp2', password: 'alipur2@123', villages: ['Birpara','Buxa','Dalgaon','Jaigaon','Rajabhat Khawa','Samuktala','Totopara'] },
    ]
  },
  {
    district: 'Murshidabad',
    block: 'Berhampore',
    panchayats: [
      { name: 'Berhampore GP-1', code: 'berhampore1gp1', password: 'berhampur1@123', villages: ['Azimganj','Berhampore','Domkal','Farakka','Jangipur','Jiaganj','Kandi'] },
      { name: 'Berhampore GP-2', code: 'berhampore2gp2', password: 'berhampur2@123', villages: ['Khargram','Lalgola','Murshidabad','Nabagram','Raghunathganj','Raninagar','Suti'] },
    ]
  },
  {
    district: 'Nadia',
    block: 'Krishnanagar-I',
    panchayats: [
      { name: 'Krishnanagar GP-1', code: 'krishnanagar1gp1', password: 'krishna1@123', villages: ['Chapra','Haringhata','Karimpur','Krishnanagar','Nabadwip','Nakashipara','Ranaghat'] },
      { name: 'Krishnanagar GP-2', code: 'krishnanagar2gp2', password: 'krishna2@123', villages: ['Santipur','Shantipur','Tehatta','Chakdah','Hanskhali','Kalyani','Shikarpur'] },
    ]
  },
  {
    district: 'North 24 Parganas',
    block: 'Barasat-I',
    panchayats: [
      { name: 'Barasat GP-1', code: 'barasat1gp1', password: 'barasat1@123', villages: ['Ashoknagar','Barasat','Basirhat','Bongaon','Deganga','Gaighata','Habra'] },
      { name: 'Barasat GP-2', code: 'barasat2gp2', password: 'barasat2@123', villages: ['Haroa','Hingalganj','Matia','Minakhan','Rajarhat','Sandeshkhali','Swarupnagar'] },
    ]
  },
  {
    district: 'South 24 Parganas',
    block: 'Diamond Harbour-I',
    panchayats: [
      { name: 'Diamond Harbour GP-1', code: 'diamondharbour1', password: 'diamond1@123', villages: ['Baruipur','Bishnupur','Canning','Diamond Harbour','Falta','Jaynagar','Kakdwip'] },
      { name: 'Diamond Harbour GP-2', code: 'diamondharbour2', password: 'diamond2@123', villages: ['Kulpi','Kultali','Magrahat','Mathurapur','Namkhana','Patharpratima','Sagar'] },
    ]
  },
  {
    district: 'Purulia',
    block: 'Manbazar-I',
    panchayats: [
      { name: 'Manbazar GP-1', code: 'manbazar1gp1', password: 'manbazar1@123', villages: ['Adra','Arsha','Balarampur','Barabazar','Hura','Jhalda','Kashipur'] },
      { name: 'Manbazar GP-2', code: 'manbazar2gp2', password: 'manbazar2@123', villages: ['Manbazar','Neturia','Para','Puncha','Raghunathpur','Santuri','Sirka'] },
    ]
  },
  {
    district: 'West Midnapore',
    block: 'Kharagpur-I',
    panchayats: [
      { name: 'Kharagpur GP-1', code: 'kharagpur1gp1', password: 'kharagpur1@123', villages: ['Chandrakona','Daspur','Ghatal','Jhargram','Keshpur','Kharagpur','Medinipur'] },
      { name: 'Kharagpur GP-2', code: 'kharagpur2gp2', password: 'kharagpur2@123', villages: ['Narayangarh','Nayagram','Pingla','Sabang','Sankrail','Salboni','Shilda'] },
    ]
  },
  {
    district: 'East Midnapore',
    block: 'Tamluk',
    panchayats: [
      { name: 'Tamluk GP-1', code: 'tamluk1gp1', password: 'tamluk1@123', villages: ['Contai','Egra','Haldia','Mahishadal','Mecheda','Nandakumar','Panskura'] },
      { name: 'Tamluk GP-2', code: 'tamluk2gp2', password: 'tamluk2@123', villages: ['Potashpur','Ramnagar','Sahid Matangini','Sutahata','Tamluk'] },
    ]
  },
  {
    district: 'Malda',
    block: 'English Bazar',
    panchayats: [
      { name: 'English Bazar GP-1', code: 'englishbazar1gp1', password: 'engbazar1@123', villages: ['Bamangola','Chanchal','English Bazar','Gazole','Habibpur','Harischandrapur','Kaliachak'] },
      { name: 'English Bazar GP-2', code: 'englishbazar2gp2', password: 'engbazar2@123', villages: ['Manikchak','Mothabari','Old Malda','Ratua'] },
    ]
  },
  {
    district: 'Darjeeling',
    block: 'Kurseong',
    panchayats: [
      { name: 'Kurseong GP-1', code: 'kurseong1gp1', password: 'kurseong1@123', villages: ['Darjeeling','Jorebunglow','Kalimpong','Kurseong','Mirik','Phansidewa','Rangli Rangliot'] },
      { name: 'Kurseong GP-2', code: 'kurseong2gp2', password: 'kurseong2@123', villages: ['Bijanbari','Naxalbari','Siliguri','Srikhola','Sukhiapokhri','Rishyap'] },
    ]
  },
  {
    district: 'Uttar Dinajpur',
    block: 'Raiganj',
    panchayats: [
      { name: 'Raiganj GP-1', code: 'raiganj1gp1', password: 'raiganj1@123', villages: ['Chopra','Goalpokhar','Hemtabad','Islampur','Itahar','Karandighi','Raiganj'] },
      { name: 'Raiganj GP-2', code: 'raiganj2gp2', password: 'raiganj2@123', villages: ['Kaliaganj','Kornelius','Dalkhola','Sudarshanpur'] },
    ]
  },
  {
    district: 'Dakshin Dinajpur',
    block: 'Balurghat',
    panchayats: [
      { name: 'Balurghat GP-1', code: 'balurghat1gp1', password: 'balurghat1@123', villages: ['Balurghat','Bansihari','Buniadpur','Cumrakhali','Gangarampur','Hili','Kushmandi'] },
      { name: 'Balurghat GP-2', code: 'balurghat2gp2', password: 'balurghat2@123', villages: ['Kumarganj','Patiram','Tapan','Tapan 2'] },
    ]
  },
  {
    district: 'Cooch Behar',
    block: 'Cooch Behar-I',
    panchayats: [
      { name: 'Cooch Behar GP-1', code: 'coochbehar1gp1', password: 'coochbehar1@123', villages: ['Cooch Behar','Dinhata','Mathabhanga','Mekhliganj','Sitai','Sitalkuchi','Tufanganj'] },
      { name: 'Cooch Behar GP-2', code: 'coochbehar2gp2', password: 'coochbehar2@123', villages: ['Boxirhat','Haldibari','Changrabandha','Pundibari','Ghoksadanga'] },
    ]
  },
  {
    district: 'Alipurduar',
    block: 'Alipurduar-II',
    panchayats: [
      { name: 'Alipurduar-II GP-1', code: 'alipurduar2blkgp1', password: 'alipur2blk1@123', villages: ['Alipurduar','Barobisha','Birpara','Cooch Behar Road','Falakata','Hasimara','Kalchini'] },
      { name: 'Alipurduar-II GP-2', code: 'alipurduar2blkgp2', password: 'alipur2blk2@123', villages: ['Kumar gram','Madarihat','Samuktala','Shalmari','Kharibari'] },
    ]
  },
  {
    district: 'Kalimpong',
    block: 'Kalimpong-I',
    panchayats: [
      { name: 'Kalimpong GP-1', code: 'kalimpong1gp1', password: 'kalimpong1@123', villages: ['Algarah','Delo','Gorubathan','Kalimpong','Lava','Lolay','Pedong'] },
      { name: 'Kalimpong GP-2', code: 'kalimpong2gp2', password: 'kalimpong2@123', villages: ['Reyang','Relli','Samsing','Suntaleykhola','Tista Bazaar'] },
    ]
  },
  {
    district: 'Jhargram',
    block: 'Jhargram',
    panchayats: [
      { name: 'Jhargram GP-1', code: 'jhargram1gp1', password: 'jhargram1@123', villages: ['Belpahari','Binpur','Gopiballavpur','Jamboni','Jhargram','Lalgarh','Nayagram'] },
      { name: 'Jhargram GP-2', code: 'jhargram2gp2', password: 'jhargram2@123', villages: ['Sankrail','Silda','Garbeta','Keshiari','Chandrakona Road'] },
    ]
  },
  {
    district: 'Paschim Bardhaman',
    block: 'Asansol',
    panchayats: [
      { name: 'Asansol GP-1', code: 'asansol1gp1', password: 'asansol1@123', villages: ['Andal','Asansol','Barabani','Chittaranjan','Durgapur','Faridpur','Hirapur'] },
      { name: 'Asansol GP-2', code: 'asansol2gp2', password: 'asansol2@123', villages: ['Jamuria','Kanksa','Kulti','Ondal','Pandaveswar','Raniganj','Salanpur'] },
    ]
  },
  {
    district: 'Purba Bardhaman',
    block: 'Katwa-I',
    panchayats: [
      { name: 'Katwa GP-1', code: 'katwa1gp1', password: 'katwa1@123', villages: ['Ausgram','Bhatar','Burdwan','Galsi','Jamalpur','Kanksa','Katwa'] },
      { name: 'Katwa GP-2', code: 'katwa2gp2', password: 'katwa2@123', villages: ['Ketugram','Khandaghosh','Memari','Monteswar','Purbasthali','Raina','Mangalkot'] },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════
const seed = async () => {
  try {
    console.log('\n🌱 Starting Full West Bengal Panchayat Seed...\n');
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalDistricts = new Set();

    for (const entry of allData) {
      totalDistricts.add(entry.district);
      for (const p of entry.panchayats) {
        // Normalize panchayat code: remove spaces, lowercase
        const code = p.code.replace(/\s+/g, '').toLowerCase();
        const adminEmail = `${code}@panchayat.com`;

        // Hash password fresh
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(p.password, salt);

        const existing = await Panchayat.findOne({ panchayatCode: code });

        if (existing) {
          await Panchayat.findOneAndUpdate(
            { panchayatCode: code },
            {
              panchayatName:  p.name,
              adminEmail,
              adminPassword:  hashedPassword,
              villages:       p.villages,
              districtName:   entry.district,
              blockName:      entry.block,
            }
          );
          totalUpdated++;
        } else {
          await Panchayat.create({
            districtName:  entry.district,
            blockName:     entry.block,
            panchayatName: p.name,
            panchayatCode: code,
            adminEmail,
            adminPassword: hashedPassword,
            villages:      p.villages,
          });
          totalCreated++;
        }
        console.log(`✅ ${entry.district} → ${p.name} | ${adminEmail}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎉 Done! ${totalCreated} created, ${totalUpdated} updated.`);
    console.log(`📍 Total districts seeded: ${totalDistricts.size}`);
    console.log('\n📋 ADMIN LOGIN — Nanoor Block, Birbhum (sample):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for (const p of allData[0].panchayats) {
      const code = p.code.replace(/\s+/g, '').toLowerCase();
      console.log(`${p.name.padEnd(25)} → ${code}@panchayat.com  /  ${p.password}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err.message);
    process.exit(1);
  }
};

seed();
