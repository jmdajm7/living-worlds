/*
     FILE ARCHIVED ON 9:54:05 May 30, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:51:22 Aug 21, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var scenes = [
	{
		month: '01January',
		scpt: 'janclrscpt',
		name: 'V26janclr', 
		title: 'January - Winter Forest - Clear',
		sound: 'V13'
	},
	{
		monthIdx: 0,
		month: '01January',
		scpt: 'jansnowscpt',
		name: 'V26SNOWjansnow', 
		title: 'January - Winter Forest - Snow',
		sound: 'V05RAIN',
		maxVolume: 0.25
	},
	{
		monthIdx: 1,
		month: '02February',
		scpt: 'febclrscpt',
		name: 'V19febclr', 
		title: 'February - Mountain Stream - Clear',
		sound: 'V19'
	},
	{
		month: '02February',
		scpt: 'febcldyscpt',
		name: 'V19febcldy', 
		title: 'February - Mountain Stream - Cloudy',
		sound: 'V19'
	},
	{
		monthIdx: 2,
		month: '03March',
		scpt: 'MARCLRSCPT',
		name: 'VW3BASIC', 
		title: 'March - Monolith Plains - Clear',
		sound: 'V13'
	},
	
	{
		monthIdx: 3,
		month: '04April',
		scpt: 'aprclrscpt',
		name: 'V30aprclr', 
		title: 'April - Deep Forest - Clear',
		sound: 'V30',
		maxVolume: 0.25
	},
	{
		month: '04April',
		scpt: 'aprrainscpt',
		name: 'V30RAINaprrain', 
		title: 'April - Deep Forest - Rain',
		sound: 'V30RAIN'
	},
	
	{
		monthIdx: 4,
		month: '05May',
		scpt: 'MAYCLRSCPT',
		name: 'V08mayclr', 
		title: 'May - Jungle Waterfall - Clear',
		sound: 'V08',
		maxVolume: 0.25
	},
	{
		month: '05May',
		scpt: 'MAYCLDYSCPT',
		name: 'V08maycldy', 
		title: 'May - Jungle Waterfall - Cloudy',
		sound: 'V08',
		maxVolume: 0.25
	},
	{
		month: '05May',
		scpt: 'MAYRAINSCPT',
		name: 'V08RAINmayrain', 
		title: 'May - Jungle Waterfall - Rain',
		sound: 'V08RAIN'
	},
	{
		monthIdx: 5,
		month: '06June',
		scpt: 'jundayscpt',
		name: 'V20JOEjunday', 
		title: 'June - Crystal Caves - Clear',
		sound: 'V20'
	},
	{
		monthIdx: 6,
		month: '07July',
		scpt: 'julyclearscpt',
		name: 'V25julyclr', 
		title: 'July - Desert - Clear',
		sound: 'V25HEAT'
	},
	{
		month: '07July',
		scpt: 'julycloudyscpt',
		name: 'V25julycldy', 
		title: 'July - Desert - Cloudy',
		sound: 'V25HEAT'
	},
	{
		monthIdx: 7,
		month: '08August',
		scpt: 'augclrscpt',
		name: 'CORAL', 
		title: 'August - Aquarius - Clear',
		sound: 'CORAL',
		maxVolume: 0.25,
		remap: {
			0: [0,0,0]
		}
	},
	{
		monthIdx: 8,
		month: '09September',
		scpt: 'SEPTCLRCUMSCPT',
		name: 'V29septclr', 
		title: 'September - Seascape - Clear',
		sound: 'V29',
		remap: {
			252: [11,11,11]
		}
	},
	{
		month: '09September',
		scpt: 'SEPTCLDYSCPT',
		name: 'V29septcldy', 
		title: 'September - Seascape - Cloudy',
		sound: 'V29',
		remap: {
			252: [11,11,11]
		}
	},
	{
		monthIdx: 9,
		month: '10October',
		scpt: 'octbegclrscpt',
		name: 'V05AMoctbegclr',
		title: 'Early October - Haunted Ruins - Clear',
		sound: 'V13',
		remap: {
			254: [0,0,0],
			0: [11,11,11]
		}
	},
	{
		month: '10October',
		scpt: 'octendclrscpt',
		name: 'V05octendclr',
		title: 'Late October - Haunted Ruins - Clear',
		sound: 'V13',
		remap: {
			254: [0,0,0],
			0: [11,11,11]
		}
	},
	{
		month: '10October',
		scpt: 'octrainscpt',
		name: 'V05RAINoctrain',
		title: 'Late October - Haunted Ruins - Rain',
		sound: 'V05RAIN',
		remap: {
			254: [0,0,0],
			0: [11,11,11]
		}
	},
	{
		monthIdx: 10,
		month: '11November',
		scpt: 'novclrscpt',
		name: 'V16novclr',
		title: 'November - Mirror Pond - Clear',
		sound: 'V16'
	},
	{
		month: '11November',
		scpt: 'novrainscpt',
		name: 'V16RAINnovrain',
		title: 'November - Mirror Pond - Rain',
		sound: 'V16RAIN'
	},
	
	// missing 640x480 LBM for december
	
	{
		monthIdx: 11,
		month: '12December',
		scpt: 'DECCLRSCPT',
		name: 'V12BASICdecclr',
		title: 'December - Winter Manor - Clear',
		sound: 'V13'
	}
];
