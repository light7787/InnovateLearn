import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView, Text, View } from "react-native";
import HeaderComponent from "@/app/components/AppHeader";
import { router } from "expo-router";
import Typography from "@/constants/typography";
import { API_BASE } from "@/constants/env";

const TermsScreen = () => {
  const [apiResult, setApiResult] = useState<string>("");

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await fetch(`${API_BASE}`);
        if (response.ok) {
          const text = await response.text();
          setApiResult(text);
        } else {
          setApiResult(`Error: ${response.status} ${response.statusText}`);
        }
      } catch (error: any) {
        setApiResult(`Fetch error: ${error.message || error.toString()}`);
      }
    };
    fetchRoot();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-river-blue-1">
      <HeaderComponent title="" onBackPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="w-full max-w-[342px] mb-10 self-center">
          <Text
            className="text-2xl text-river-blue-6 mb-7"
            style={Typography.headline5}
          >
            Privacy Policy
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            River Mobility Private Limited, a private limited company,
            incorporated and existing under the laws of India and having its
            Registered Address No. 25/3, KIADB EPIP Zone, Seetharampalya-Hoodi
            Road Mahadevapura, Whitefield Bengaluru 560048 and Corporate
            Identification Number is (CIN) U31400KA2022PTC158972 (hereinafter
            referred to as “We”, “us”, “Company” or “our”) is concerned about
            the privacy of the users (hereinafter referred to as “you”, “your”
            or “user”) of its website (“Website”) and application (App) located
            at www.rideriver.com and has provided this privacy policy statement
            (the “Privacy Policy”) to familiarise you with: the manner in which
            Company collects, uses and discloses your information collected
            through the Website.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Purpose
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            The purpose of this policy is to ensure that the information of /
            provided by any Users visiting the Website/App is stored in
            accordance with Digital Personal Data Protection Act, 2023,
            Information Technology (Amendments) Act 2008 and other related
            applicable laws. The information stored in such a manner shall be
            protected by River Mobility Private Limited (“Company”) via a secure
            server software, which is the industry standard and among the best
            software available today for secure transactions. Company’s Privacy
            Policy explains: What information is collected and why such
            information is collected;
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            The term “Account” as referred to in this Privacy Policy shall mean
            and include the Account held by the User with Company (administered
            by a password) for using the services as provided by Company.
            Further, We may decline to process requests which We find to be
            contrary to the terms laid down under this Privacy Policy, Our terms
            and conditions (“Terms and Conditions”) or any applicable laws,
            require disproportionate technical effort, jeopardise the privacy of
            others are extremely impractical.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Nature of Data Collected by Us
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            We may collect and process following information (including but not
            limited) pertaining to you based on your consent.
            {"\n"}a. Personal Information - This includes the information that
            can be used to uniquely identify or contact you. In order to avail
            the services provided by us, We may collect a variety of Personal
            Information, including but not limited Demographic, Identity &
            Contact Data (for e.g., name, last name, date of birth, gender,
            email address, address proof, contact number, language, occupation,
            physical address with pin code, preferences and interests.)
            {"\n"}b. Personal Identification Number (for e.g., PAN Card No,
            Voter ID, GST no, Passport and Aadhaar Number) etc.
            {"\n"}c. Financial Account Details (for e.g., Bank account details)
            {"\n"}d. Educational & Professional Data
            {"\n"}e. Online Identifiers and other Technical Data (for e.g., IP
            address, browser type, device identifiers)
            {"\n"}f. Personal Data collected via permissions on our mobile
            applications (for e.g., camera contacts, location data, storage,
            photos, fingerprint/biometric and SMS)
            {"\n"}g. Vehicle Data (for e.g., registration number, registration
            type, registration data, and model type)
            {"\n"}h. Ride Data (for e.g., mileage, travel location, travel date,
            time, top speed, average speed, driver behaviour data such as speed
            and braking habits.)
            {"\n"}i. Telematics Data (for e.g., data about speed, bike fall and
            crash)
            {"\n"}j. Communications details (for e.g., communication done
            through emails)
            {"\n"}k. Generated Data (for e.g., logs, transaction records)
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Sensitive Personal Data or Information (SPDI)
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Sensitive personal data or information of a person means such
            personal information which consists of information relating to:
            {"\n"}a. password;
            {"\n"}b. financial information such as Bank account or credit card
            or debit card or other payment instrument details;
            {"\n"}c. physical, physiological and mental health condition;
            {"\n"}d. sexual orientation;
            {"\n"}e. medical records and history;
            {"\n"}f. Biometric information;
            {"\n"}g. any detail relating to the above clauses as provided to
            body corporate for providing service; and
            {"\n"}h. any of the information received under above clauses by body
            corporate for processing, stored or processed under lawful contract
            or otherwise.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            User Consent
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Depending upon the activity you wish to carry out on the
            Website/App, the information provided to us shall be identified
            either as mandatory or voluntary. An activity which requires
            information to be mandatorily provided shall not be engaged if you
            abstain from providing such information. The Personal Information is
            collected from you in a voluntary fashion when you provide your
            credentials on the Website/App managed by us. You are required to
            ensure that your contact information and preferences are accurate,
            complete and up to date by logging into your Account. We shall also
            make reasonable efforts to provide you with the opportunity to
            request correction of data relating to your Personal Information if
            the same is inaccurate or delete the data.
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            By using this Website/App and services provided on the Website, you
            agree and you also acknowledge that with respect to certain
            activities, the collection, transfer, storage and processing of your
            information may be undertaken by trusted third party vendors or
            agents of Company such as credit card processors, web hosting
            providers, communication services, and web analytic providers etc.,
            to help facilitate Us in providing certain functions.
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Our Website gathers some information automatically when you visit
            the URL of the Website and stores it in log files. When you use the
            Website and the services provided, We may collect certain
            information about your computer to facilitate, evaluate and verify
            your use of the Website, and the products and the services available
            on the Website. For example, We may store environmental variables,
            such as browser type, operating system, speed of the central
            processing unit (CPU), referring or exit web pages, click patterns
            and the internet protocol (IP) address of your computer. This
            information is generally collected in aggregate form, without
            identifying any user individually.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Cookies
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Your browser software includes a feature called "cookies”. Our
            site/app automatically collects some data of your computer and
            parallel internet usage but none of these include your personal
            information. We use temporary cookies but these expire when you
            leave our site. GPS- We also use the location tracking services
            (GPS) to gather data which is critical for providing certain
            features on the site/app. This features enables user to track their
            vehicle and protection against theft and damages Non-Personal
            Information: Non-Personal Information is any information that does
            not reveal your specific identity, such as, browser information,
            information collected through Cookies, pixel tags and other
            technologies, demographic information, etc. We may use cookies to:
            (i) keep count of your return visits to the Website/ App; (ii)
            accumulate anonymous, aggregate, statistical information on Website/
            App usage; (iii) deliver content specific to your interests or past
            viewing history; and (iv) save your password so you don’t have to
            re-enter it each time you visit our sites. You can also disable
            cookies. By modifying your browser preferences, you can accept or
            reject all cookies, or request a notification when a cookie is set.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Protection of User Information
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Our Website/ App has strict security measures for protection of
            personal information provided to us. We store all personal
            information in a secure manner preventing its loss, misuse, wrongful
            disclosure, alteration or destruction. However, we are not liable
            for breach of security during internet transmission of personal
            information, including any unintended loss, misuse, alteration or
            disclosure of such information. Furthermore, notwithstanding
            anything contained in this privacy policy, we shall not be
            responsible for any loss, damage or misuse of personal information,
            if such loss, damage or misuse is attributable to an event of Force
            Majeure or to any reason attributable to the user.
            {"\n\n"}Personal information will be erased if their storage
            violates any of the data protection rules. Additionally, we has the
            right to retain the personnel information for legal and regulatory
            purposes and as per applicable data privacy laws.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Information Security
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            We work hard to protect you from unauthorised access to or
            unauthorised alteration, disclosure or destruction of information we
            hold. Pursuant to the same, we: Encrypt our services using secure
            server software, which is the industry standard and among the best
            software available today for secure transactions. Review our
            information collection, storage and processing practices, including
            physical security measures to guard against unauthorised access to
            systems. Company does not rent, sell or share your Personal
            Information with third parties or non affiliated companies except to
            provide the services you have requested. We limit the disclosure of
            Personal Information to Our employees, independent contractors
            including vendors, affiliates, consultants, business associates,
            service providers and distributors of Our services, on a
            “need-to-know” basis, and only if the disclosure will enable that
            entity to provide Us with business, professional, or technical
            support or fulfil your request.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            User Rights
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Anyone having user account on our Website/ App can access their
            information under the profile section and can
            update/modify/correct/delete their personal data.
            {"\n\n"}Users can request details of their Personal Information
            available with us, purposes for which they are being used or might
            be used in the future and with whom such data has been shared.
            {"\n\n"}Users may contact the Grievance Officer in case they wish to
            make a complaint regarding the manner in which their personal
            information has been handled by us.
            {"\n\n"}Users need not provide reasons for seeking access to their
            details on the Website/ App subject to furnishing proof of identity.
            {"\n\n"}Users can withdraw their consent to the storage or
            processing of their Personal Information and such data shall be
            erased by Us. If there are any contractual obligations, legal
            obligations to retain such data, the same shall not be erased
            inspite of a request for withdrawal made by the user.
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Company provides all its Users with the opportunity to opt-out of
            receiving non-essential (promotional, marketing-related)
            communications from Us or on behalf of Our partners after setting up
            an Account. If you want to remove your contact information from all
            Our lists and newsletters, please write to us at
            support@rideriver.com with “unsubscribe” as the subject.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Information We Share
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Company may disclose any information provided by you on the Site as
            may be deemed to be necessary or appropriate:
            {"\n\n"}• under applicable law, including laws outside your country
            of residence;
            {"\n"}• to comply with legal process;
            {"\n"}• to respond to requests from public and government
            authorities including public and government authorities outside your
            country of residence;
            {"\n"}• to enforce Our Terms of Use;
            {"\n"}• to protect Our operations or those of any of Our affiliates;
            {"\n"}• to protect Our rights, privacy, safety or property, and/or
            that of Our affiliates, you or others; and
            {"\n"}• to allow Us to pursue available remedies or limit the
            damages that We may sustain.
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            We may share Personal Information with other corporate entities and
            affiliates to: Help detect and prevent identity theft, fraud and
            other potentially illegal acts; Correlate related or multiple
            accounts to prevent abuse of Our services; and To facilitate joint
            or co-branded services that you request for where such services are
            provided by more than one corporate entity. We may disclose Personal
            Information to: Third parties in good faith, and such disclosure
            shall be reasonably necessary to enforce Our Terms of Use or the
            Privacy Policy, or to respond to claims of violation of third party
            rights through advertisements, postings or other content; To
            Company’s third party providers who provide goods / services such as
            contact information verification, payment processing, order
            fulfilment, customer service, website hosting, data analysis,
            infrastructure provision, IT services, auditing services and other
            similar services to enable them to provide the relevant services;
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Change in Privacy Policy
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            The User acknowledges that becoming a User of the Website and its
            Services signifies their assent to this privacy policy. Company may
            update this privacy policy at any time, with or without advance
            notice. In the event there are significant changes in the way
            Company treats User’s personally identifiable information, Company
            will display a notice on the Website or send Users an email, as
            provided for above. Unless stated otherwise, Company’s current
            privacy policy applies to all information that Company has about
            Users and their account. Notwithstanding the above, Company shall
            not be required to notify the Users of any changes made to the
            privacy policy. If a User uses the Services after notice of changes
            have been sent to such User or published on the Website, such User
            hereby provides his/her/its consent to the changed practices.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Advertisements
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Some of the advertisements you see on the Website are selected and
            delivered by third parties, such as ad networks, advertising
            agencies, advertisers, and audience segment providers. These third
            parties may collect information about you and your online
            activities, either on the Website or on other websites, through
            cookies, web beacons, and other technologies in an effort to
            understand your interests and deliver to you advertisements that are
            tailored to your interests. Please remember that the Company does
            not have access to, or control over, the information these third
            parties may collect. The information practices of these third
            parties are not covered by this Privacy Policy.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Contact Information
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            If you have any complaints, grievance, issues with the way we
            process data or you need any clarification on our privacy practices
            you can always contact the following:
            {"\n\n"}Grievance Officer
            {"\n"}C/o. River Mobility Private Limited
            {"\n"}Name: Mr. Binesh Nair
            {"\n"}Email ID: binesh@rideriver.com
            {"\n"}Postal Address: No. 25/3, KIADB EPIP Zone, Seetharampalya
            Hoodi Road Mahadevapura, Whitefield Bengaluru 560048
            {"\n"}Contact No: 080-69537509
            {"\n\n"}Emails received on binesh@rideriver.com (email ID of
            Grievance officer) other than context of Privacy Policy will not be
            entertained. Please do not send emails to this email id for queries,
            complaints related to Sales, Service, and Recruitment etc.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Governing Laws and Arbitration
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            This Policy shall be governed by and construed in accordance with
            the laws of the Republic of India and the courts of Bengaluru shall
            have the exclusive jurisdiction.
            {"\n\n"}Any disputes arising in connection with the matters
            contemplated under this Policy shall be referred arbitration, and
            shall be finally resolved through binding arbitration under the
            (Indian) Arbitration and Conciliation Act, 1996 (as amended)
            (Arbitration Act) before a sole arbitrator as mutually appointed by
            the Parties. In the event the Parties are unable to mutually agree
            on the appointment of the arbitrator, the appointment shall be made
            in accordance with the Arbitration Act. The seat for arbitration
            shall be Bengaluru, and the arbitration shall be conducted in
            English.
          </Text>
          <Text
            className="text-river-blue-5 mb-2"
            style={[Typography.subline1]}
          >
            Disclaimer
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            Company shall not be liable for any loss or damage sustained by
            reason of any disclosure (inadvertent or otherwise) of any
            information concerning the user's account and/or their verification
            process and particulars nor for any error, omission or inaccuracy
            with respect to any information so disclosed and used whether or not
            in pursuance of a legal process or otherwise. The terms in this
            Policy may be changed by the Company at any time. Company is free to
            offer its services to any client/prospective client without
            restriction. By registering or by using this Site, you explicitly
            accept, without limitation or qualification, the collection, use and
            transfer of the Personal Information provided by you in the manner
            described in this Privacy Policy. Please read this Privacy Policy
            carefully as it affects your rights and liabilities under law. If
            you do not accept the Privacy Policy stated herein or disagree with
            the way we collect and process personal information collected on the
            Site, we request you to exit the website.
          </Text>
          <Text className="text-river-blue-5 mb-4" style={[Typography.copy1]}>
            For any Questions and Queries regarding our policies you can reach
            us at support@rideriver.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
