# DarshanGo
The PM-AJAY Dashboard is a unified digital platform for monitoring Adarsh Gram, GIA, and Hostel components. It streamlines agency coordination, tracks project progress, milestones, and fund flow, and enhances transparency, accountability, and real-time decision-making across States/UTs.
PM-AJAY aims for socio-economic empowerment of Scheduled Castes (SCs) through infrastructure, education, and community upliftment.
It has 3 major components:

1.1 Component 1 – Adarsh Gram (Model Village Development)
Objective
  Holistic development of villages with high SC populations into Model Villages having:
    Roads, water supply, sanitation
    Aganwadi centers
    Community halls
    Streetlights
    Digital education
    Livelihood infrastructure

Implementation
I  mplementing Agency: State/UT Social Welfare/SC Development Department
  Executing Agencies:
    State Rural Development Dept.
    Panchayat Raj Institutions (PRIs)
    Public Works Department (PWD)
    Rural engineering departments

Funds
  Released from the Centre → State → Executing Agencies
  Lack of tracking often results in delays

Challenges
  No real-time monitoring
  No consolidated list of executing agencies
  Hard to track which agency is doing what work

1.2 Component 2 – GIA (Grants-in-Aid to NGOs/Institutions)
Objective
  Provide grants to:
    NGOs
    Welfare organizations
    Educational institutions
    Skill centers 
  To run programs like:
    Coaching
    Skill development
    Hostels
    Health camps
    Awareness and training

Implementation
  Implementing Agency: Ministry of Social Justice
  Executing Agencies: Registered NGOs, institutions, trusts

Challenges
  Fragmented communication between Centre → State → NGOs
  Lack of transparency in:
    Fund flow
    NGO performance
    Approvals
  No centralized mapping of NGOs receiving funds

1.3 Component 3 – Construction of Hostels (for SC boys & girls)
Objective
  Increase access to education by building: 
    Boys hostels
    Girls hostels
    Integrated residential complexes

Implementation
  Implementing Agency: State/UT Govt
  Executing Agencies:
    PWD
    State Construction Corporations
    Education Dept
    Municipal bodies
Challenges
  Multiple agencies cause miscommunication
  Slow construction progress
  No dashboard to track work stages (Tendering → Foundation → Construction → Completion)

Problem Diagnosis from the Statement-
  Key Issues Identified
    No centralized mapping	Agencies working in silos → duplication + miscommunication
    Multiple executing agencies →	Causes delay, unclear responsibility
    Coordination bottlenecks → Between Centre, State, NGOs, and local bodies
    No digital dashboard Manual reporting → delays and errors
    Fund flow transparency	→ No real-time tracking of releases and utilization
    Role ambiguity → Unclear duties → accountability issues
    
Solution: Dashboard Interface Structure-

Below is a full digital dashboard design addressing all issues.

PM-AJAY Central Monitoring Dashboard
(Role-based Web Portal + Mobile interface for officers)
  A. USER ROLES
    Central Administrator (MoSJ&E)
    State Nodal Officer
    District Officer
    Executing Agency Head (PWD/NGO/PRIs)
    Auditor/Monitoring Team
    Public/RTI View (Limited access)
  B. MAIN DASHBOARD MODULES
    1. Home Dashboard (Analytics Overview)
      Visual Cards:
        Total Projects (Adarsh Gram, GIA, Hostels)
        Funds Released vs Utilized (Real-time)
        State-wise Progress Heatmap
        Delayed Projects Flag
        Active Executing Agencies Count
        Alerts (non-compliance, delay, incomplete reporting)
      Charts:
        Bar Chart: Component-wise fund usage
        Timeline Chart: Project milestones
        Map View: District-wise progress
    
  2. Agency Mapping Module (Most Important)
      Features:
        ✔ Central database of all implementing and executing agencies
        ✔ Agency type: State Dept, PWD, NGO, PRI, Construction Corp, etc.
        ✔ Unique Agency Code (auto-generated)
        ✔ Hierarchy: Centre → State → District → Executing Agency → Project
        ✔ Responsibility Matrix
        ✔ Communication Log between agencies
      Interface:
        Search Bar (by state, district, agency type)
        Map view showing agencies
        Filters:
        Component-wise (Adarsh Gram / GIA / Hostel)
        Agency role (Implementing / Executing)
        Status (Active / Pending / Blacklisted)
    
   3. Project Management Module
      For all 3 components:
        Project Details:
          Work ID
          Component: Adarsh Gram / GIA / Hostel
          Executing Agency
          Timeline & milestones
          Fund stages (Req → Approved → Released → Utilized)
          Geo-tagged photos (Before/After)
          Progress tracking (0–100%)
        Workflow:
          Proposal submission
          Technical sanction
          Fund release
          Work order → Execution → Completion
          
   4. Fund Flow Tracking Module (End-to-End)
      Dashboard shows:
        Ministry → State → District → Agency → Vendor
        Real-time fund movement
      Alerts for:
        Delay in fund release
        Pending utilization certificates
        Fund diversion risk
      Features:
        UTR number tracking
        Auto-notifications to officers
        Ledger view per project
      
   5. Communication & Coordination Module
    Solves mismatch between Centre–State–Agencies
      Includes:
        ✔ Video conferencing feature
        ✔ Task allocation
        ✔ Issue escalation system
        ✔ Automated reminders
        ✔ Inter-department message board
   
   6. Document Repository
      DPRs
      Sanction Orders
      Work orders
      NGO approval letters
      Completion certificates
      Audit reports
      Geo-tagged evidence
   
   7. Monitoring & Evaluation Module
      Third-party monitoring integration
      AI-based delay prediction
      Quality assessment indicators
      Inspection scheduling
    Risk score per project
   
   8. Compliance & Accountability Module
      Tracks:
        Adherence to guidelines
        Roles and responsibilities
        Delays caused by particular agency
        Audit trails
        Accountability score for officials
    
  9. Public Transparency Portal (Limited Data)
      Model Village list
      Hostel construction progress
     Approved NGOs under GIA
     Fund usage summary
