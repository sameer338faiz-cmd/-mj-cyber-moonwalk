export interface EasypaisaConfig {
  accountTitle: string;
  accountNumber: string;
  qrImageUrl: string; // Base64 or Image URL
  noteInstructions: string;
  isEnabled: boolean;
}

const STORAGE_KEY = 'mj_cyber_easypaisa_config';

// Default initial dummy QR code (SVG data URL representing a clean Easypaisa styled QR Code)
const DEFAULT_QR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none"><rect width="240" height="240" rx="20" fill="%23000000"/><rect x="15" y="15" width="210" height="210" rx="12" fill="%230F172A" stroke="%2310B981" stroke-width="2"/><rect x="30" y="30" width="50" height="50" rx="8" fill="%2310B981"/><rect x="40" y="40" width="30" height="30" rx="4" fill="%230F172A"/><rect x="48" y="48" width="14" height="14" rx="2" fill="%2310B981"/><rect x="160" y="30" width="50" height="50" rx="8" fill="%2310B981"/><rect x="170" y="40" width="30" height="30" rx="4" fill="%230F172A"/><rect x="178" y="48" width="14" height="14" rx="2" fill="%2310B981"/><rect x="30" y="160" width="50" height="50" rx="8" fill="%2310B981"/><rect x="40" y="170" width="30" height="30" rx="4" fill="%230F172A"/><rect x="48" y="178" width="14" height="14" rx="2" fill="%2310B981"/><path d="M100 30H140V45H100V30ZM100 60H120V80H100V60ZM130 60H150V70H130V60ZM100 90H110V110H100V90ZM120 85H150V95H120V85ZM160 90H210V100H160V90ZM30 90H80V100H30V90ZM30 110H50V120H30V110ZM60 110H90V130H60V110ZM100 120H130V140H100V120ZM140 110H170V130H140V110ZM180 110H210V120H180V110ZM180 130H200V150H180V130ZM30 140H70V150H30V140ZM100 150H120V170H100V150ZM130 150H160V160H130V150ZM170 160H210V170H170V160ZM90 180H120V200H90V180ZM130 180H170V190H130V180ZM180 180H210V210H180V180ZM90 205H110V215H90V205ZM120 200H150V210H120V200ZM160 200H170V215H160V200Z" fill="%2310B981"/><circle cx="120" cy="120" r="18" fill="%230F172A" stroke="%2310B981" stroke-width="2"/><text x="120" y="125" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="%2310B981" text-anchor="middle">EP</text></svg>`;

const DEFAULT_CONFIG: EasypaisaConfig = {
  accountTitle: 'Sameer Faiz',
  accountNumber: '0300 1234567',
  qrImageUrl: DEFAULT_QR_SVG,
  noteInstructions: 'Scan QR Code using your Easypaisa Mobile App or send funds directly to the account number. Save screenshot as receipt.',
  isEnabled: true,
};

export const EasypaisaService = {
  getConfig(): EasypaisaConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading Easypaisa config', e);
    }
    return DEFAULT_CONFIG;
  },

  saveConfig(config: EasypaisaConfig): EasypaisaConfig {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving Easypaisa config', e);
    }
    return config;
  },

  resetDefault(): EasypaisaConfig {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_CONFIG;
  }
};
