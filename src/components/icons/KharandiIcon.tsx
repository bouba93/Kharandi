import React from "react";
import {
  House,
  Search,
  Menu,
  ArrowLeft,
  ArrowRight,
  Bell,
  Heart,
  CircleUserRound,
  Settings,
  CircleHelp,
  BookOpen,
  Library,
  NotebookTabs,
  FileText,
  CirclePlay,
  SquarePen,
  BadgeHelp,
  ClipboardCheck,
  RefreshCw,
  ChartNoAxesColumnIncreasing,
  Award,
  CalendarDays,
  Languages,
  Download,
  School,
  GraduationCap,
  Presentation,
  UsersRound,
  DoorOpen,
  CalendarClock,
  UserCheck,
  ListChecks,
  FileChartColumn,
  FileCheck2,
  Trophy,
  UserRoundPlus,
  Calculator,
  Brain,
  Timer,
  Zap,
  Headphones,
  Gauge,
  Bot,
  MessageCircleQuestion,
  ScanSearch,
  Mic,
  Send,
  Plane,
  MapPinned,
  BadgeDollarSign,
  Landmark,
  SendHorizontal,
  Stamp,
  Newspaper,
  CalendarHeart,
  MessagesSquare,
  MessageSquareText,
  Share2,
  Users,
  Handshake,
  MapPin,
  Store,
  Package,
  ShoppingCart,
  BadgeCheck,
  WalletCards,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  ChartPie,
  CirclePlus,
  Trash2,
  ArchiveRestore,
  CircleCheckBig,
  CirclePause,
} from "lucide-react";

export const KHARANDI_COLORS = {
  turquoise: "#1BB4D3",
  yellow: "#FAB304",
  soft: "#E8F8FB",
  ink: "#163B45",
} as const;

export const kharandiIcons = {
  // Navigation
  accueil: House,
  recherche: Search,
  menu: Menu,
  retour: ArrowLeft,
  suivant: ArrowRight,
  notifications: Bell,
  favoris: Heart,
  profil: CircleUserRound,
  parametres: Settings,
  aide: CircleHelp,

  // Apprentissage
  cours: BookOpen,
  bibliotheque: Library,
  matieres: NotebookTabs,
  documents: FileText,
  video_cours: CirclePlay,
  exercices: SquarePen,
  quiz: BadgeHelp,
  devoirs: ClipboardCheck,
  revision: RefreshCw,
  progression: ChartNoAxesColumnIncreasing,
  certificat: Award,
  calendrier_scolaire: CalendarDays,
  langue: Languages,
  telechargement: Download,

  // École
  ecole: School,
  eleve: GraduationCap,
  enseignant: Presentation,
  parent: UsersRound,
  classe: DoorOpen,
  emploi_du_temps: CalendarClock,
  presence: UserCheck,
  notes: ListChecks,
  bulletin: FileChartColumn,
  examen: FileCheck2,
  palmares: Trophy,
  inscription: UserRoundPlus,

  // Abacus
  abacus: Calculator,
  calcul_mental: Brain,
  chronometre: Timer,
  mode_flash: Zap,
  mode_audio: Headphones,
  niveau: Gauge,

  // Intelligence artificielle
  karamo_assistant: Bot,
  poser_question: MessageCircleQuestion,
  analyse_image: ScanSearch,
  microphone: Mic,
  envoyer: Send,

  // Voyages et bourses
  voyage: Plane,
  destination: MapPinned,
  bourse: BadgeDollarSign,
  universite: Landmark,
  candidature: SendHorizontal,
  visa: Stamp,

  // Actualités et communauté
  actualites: Newspaper,
  evenement: CalendarHeart,
  discussion: MessagesSquare,
  commentaire: MessageSquareText,
  partager: Share2,
  groupe: Users,
  partenaire: Handshake,
  localisation: MapPin,

  // Boutique et paiement
  boutique: Store,
  produit: Package,
  panier: ShoppingCart,
  abonnement: BadgeCheck,
  portefeuille: WalletCards,
  paiement: CreditCard,

  // Administration
  tableau_de_bord: LayoutDashboard,
  utilisateurs: UsersRound,
  securite: ShieldCheck,
  statistiques: ChartPie,
  ajouter: CirclePlus,
  modifier: SquarePen,
  supprimer: Trash2,
  restaurer: ArchiveRestore,
  publier: CircleCheckBig,
  suspendre: CirclePause,
} as const;

export type KharandiIconName = keyof typeof kharandiIcons;

export interface KharandiIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "name" | "color"> {
  name: KharandiIconName;
  size?: number;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  title?: string;
  showBackground?: boolean;
  showBookmark?: boolean;
}

export const KharandiIcon = React.forwardRef<
  SVGSVGElement,
  KharandiIconProps
>(function KharandiIcon(
  {
    name,
    size = 32,
    primaryColor = KHARANDI_COLORS.turquoise,
    accentColor = KHARANDI_COLORS.yellow,
    backgroundColor = KHARANDI_COLORS.soft,
    title,
    showBackground = true,
    showBookmark = true,
    ...props
  },
  ref
) {
  const Icon = kharandiIcons[name] || House;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title && <title>{title}</title>}

      {showBackground && (
        <rect
          x="7"
          y="7"
          width="50"
          height="50"
          rx="13"
          fill={backgroundColor}
        />
      )}

      {showBookmark && (
        <path
          d="M44 7h8v13l-4-3-4 3V7Z"
          fill={accentColor}
        />
      )}

      <Icon
        x="12"
        y="12"
        width="40"
        height="40"
        color={primaryColor}
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      />
    </svg>
  );
});

KharandiIcon.displayName = "KharandiIcon";
