

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
 
  {
    id: 'master',
    title: 'Master',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'shift',
        title: 'Shift Type',
        type: 'item',
        url: '/shift',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'hospitaltype',
        title: 'Hospital Type',
        type: 'item',
        url: '/hospitaltype',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'medicinetype',
        title: 'Medicine Type',
        type: 'item',
        url: '/medicinetype',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
     
      {
        id: 'hospitaldepartment',
        title: 'Hospital Department',
        type: 'item',
        url: '/hospitaldepartment',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'patientdata',
        title: 'Patient Data',
        type: 'item',
        url: '/patientdata',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },

      {
        id: 'room type',
        title: 'Room Type',
        type: 'item',
        url: '/roomtype',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'Roles',
        title: 'Roles',
        type: 'item',
        url: '/roles',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'diseasetype',
        title: 'Disease Type',
        type: 'item',
        url: '/diseasetype',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
     

    ]

  },
  {
    id: 'data',
    title: 'Data',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Empshiftmapping',
        title: 'EmpShiftMapping',
        type: 'item',
        url: '/empshiftmapping',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'patientdoctormapping',
        title: 'PatientDoctorMapping',
        type: 'item',
        url: '/patientdoctormapping',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'medicinedetails',
        title: 'Medicinedetails',
        type: 'item',
        url: '/medicinedetails',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'Empdepartmentmapping',
        title: 'EmpDepartmentMapping',
        type: 'item',
        url: '/empdepartmentmapping',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'treatmentdetails',
        title: 'Treatmentdetails',
        type: 'item',
        url: '/treatmentdetails',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }


    ]
  },

  {
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/basic/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/basic/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/basic/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/basic/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/basic/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/basic/typography'
          }
        ]
      }
    ]
  },


// end


//new start
{
  id: 'master',
  title: 'Master',
  type: 'group',
  icon: 'icon-navigation',
  children: [
    {
      id: 'hospitaltype',
      title: 'hospitaltype',
      type: 'item',
      url: '/hospitaltype',
      icon: 'feather icon-home',
      classes: 'nav-item'
    }
  ]
},



//New Start:








//  END
  {
    id: 'forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms-element',
        title: 'Form Elements',
        type: 'item',
        url: '/forms/basic',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'Tables',
        type: 'item',
        url: '/tables/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'chart-maps',
    title: 'Chart',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'ApexChart',
        type: 'item',
        url: 'apexchart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'disabled-menu',
        title: 'Disabled Menu',
        type: 'item',
        url: 'javascript:',
        classes: 'nav-item disabled',
        icon: 'feather icon-power',
        external: true
      },
      {
        id: 'buy_now',
        title: 'Buy Now',
        type: 'item',
        icon: 'feather icon-book',
        classes: 'nav-item',
        url: 'https://codedthemes.com/item/datta-able-angular/',
        target: true,
        external: true
      }
    ]
  }
]
