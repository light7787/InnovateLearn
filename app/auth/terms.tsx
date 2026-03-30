import React from "react";
import { ScrollView, SafeAreaView, StatusBar, Text, View } from "react-native";
import HeaderComponent from "@/app/components/AppHeader";
import { router } from "expo-router";
import Typography from "@/constants/typography";

const TermsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-river-blue-1">
      <HeaderComponent title="" onBackPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="w-full max-w-[342px] mb-10 self-center">

          <Text
              className="text-2xl text-river-blue-6 mb-7"
              style={Typography.headline5}
          >
            Terms and Conditions
          </Text>
          <Text className="text-base text-river-blue-5 mb-6" style={Typography.copy1}>
            These Terms of Use (“Terms of Use”) have been drafted in accordance
            with the provisions of Rule 3 (1) of the Information Technology
            (Intermediaries guidelines) Rules, 2011 that require publishing the
            rules and regulations, privacy policy and Terms of Use for access or
            usage of www.rideriver.com, its subdomains,products and
            applications.
          </Text>
          
          <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}
          >
            About us{" "}
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            The domain www.rideriver.com (hereinafter referred to as "Website" /
            “application”) owned and managed by River Mobility Pvt Ltd, a
            private limited company, incorporated and existing under the laws of
            India and having its registered office at No. 25/3, KIADB EPIP Zone,
            Seetharampalya Hoodi Road Mahadevapura, Whitefield Bengaluru 560048
            and Corporate Identification Number is (CIN) U31400KA2022PTC158972
            (hereinafter referred to as “Company”) Your use of the Website and
            services and tools are governed by the following terms and
            conditions ("Terms of Use") as applicable to the Website including
            the applicable policies which are incorporated herein by way of
            reference. If You transact on the Website/ application, You shall be
            subject to the policies that are applicable to the
            Website/application/ for such transaction. By mere use of the
            Website/ application, You shall be contracting with Company and
            these terms and conditions including the policies constitute your
            binding obligations, with the Website/ application. For the purpose
            of these Terms of Use, wherever the context so requires "You" or
            "User" shall mean any natural or legal person who has agreed to
            become a user of the Website by providing Registration Data while
            registering on the Website as Registered User using the computer
            systems. This Website allows the User to navigate and browse the
            Website. The term "We", "Us", "Our" shall mean Company.
          </Text>
          <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}
          >
            Eligibility to use
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            Use of the Website is available only to persons who can form legally
            binding contracts under Indian Contract Act, 1872. Persons who are
            "incompetent to contract" within the meaning of the Indian Contract
            Act, 1872 including minors, un-discharged insolvents etc. are not
            eligible to use the Website. If you are a minor i.e. under the age
            of 18 years, you shall not register as a User of the Company website
            and shall not transact on or use the Website. As a minor if you wish
            to use or transact on Website, such use or transaction may be made
            by your legal guardian or parents on the Website. Company reserves
            the right to refuse You access to the Website if it is brought to
            Company's notice or if it is discovered that you are under the age
            of 18 years. By visiting Company Website or accepting these Terms of
            Use, You represent and warrant to Company that You are 18 years of
            age or older, and that You have the right, authority and capacity to
            use the Website and agree to and abide by these Terms of Use. You
            also represent and warrant to the Company that You will use the
            Website in a manner consistent with any and all applicable laws and
            regulations. Company reserves the right to refuse access to use the
            Services offered at the Website to new Users or to terminate access
            granted to existing Users at any time without any prior
            notification. Company reserves the right to make some payments
            non-refundable and it will be communicated to the user before any
            such payments is accepted from the user/customer.
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            Your use of Company Website/Application You shall ensure that the
            Account Information provided by You in the Website/Applications
            registration form is complete, accurate and up-to-date. Use of
            another user's Account Information for availing the Services is
            expressly prohibited. If You provide any information that is untrue,
            inaccurate, not current or incomplete (or becomes untrue,
            inaccurate, not current or incomplete), or Company has reasonable
            grounds to suspect that such information is untrue, inaccurate, not
            current or incomplete, Company has the right to suspend or terminate
            Your Account and refuse any and all current or future use of the
            Website (or any portion thereof).
          </Text>
           <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}
          >
          Privacy and Information Protection
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            Please review our Privacy Policy, which also governs your visit to
            this Site, to understand our internal policies and practices. The
            personal information / data provided to us by you during the course
            of usage of www.rideriver.com will be treated as strictly
            confidential and in accordance with the Privacy Policy and
            applicable laws and regulations. 
            </Text>
            <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
            Rights of use
            </Text>
            
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              Company grants you limited rights to access and make personal use
              of this Website/Applications, but not to download (other than page
              caching) or modify it, or any portion of it. These rights do not
              include any commercial use of this Website/Applications or its
              contents; any collection and use of any content, descriptions, or
              prices; any derivative use of this Website/Applications or its
              contents; any downloading or copying of account information for
              the benefit of a third-party; or any use of data mining, robots,
              or similar data gathering and extraction tools. This
              Website/Applications or any portion of this Website/Applications
              (including but not limited to any copyrighted material,
              trademarks, or other proprietary information) may not be
              reproduced, duplicated, copied, sold, resold, visited, distributed
              or otherwise exploited for any commercial purpose.
            </Text>

           <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}
          >
          Your conduct 
          </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              You must not use the Website/Applications in any way that causes,
              or is likely to cause, the Website/Applications or access to it to
              be interrupted, damaged or impaired in any way. You understand
              that you, and not Company, are responsible for all electronic
              communications and content sent from your computer to us and you
              must use the Website/Applications for lawful purposes only. You
              must not use the Website/Applications for any of the following:
              for fraudulent purposes, or in connection with a criminal offence
              or other unlawful activity to send, use or reuse any material that
              does not belong to you; or is illegal, offensive (including but
              not limited to material that is sexually explicit content or which
              promotes racism, bigotry, hatred or physical harm), deceptive,
              misleading, abusive, indecent, harassing, blasphemous, defamatory,
              libellous, obscene, pornographic, pedophilic or menacing;
              ethnically objectionable, disparaging or in breach of copyright,
              trademark, confidentiality, privacy or any other proprietary
              information or right; or is otherwise injurious to third parties;
              or relates to or promotes money laundering or gambling; or is
              harmful to minors in any way; or impersonates another person; or
              threatens the unity, integrity, security or sovereignty of India
              or friendly relations with foreign States; or objectionable or
              otherwise unlawful in any manner whatsoever; or which consists of
              or contains software viruses, political campaigning, commercial
              solicitation, chain letters, mass mailings or any "spam” to cause
              annoyance, inconvenience or needless anxiety We reserve the right
              to initiate action under applicable laws for unauthorised use,
              exploitation or disclosure of vulnerabilities, content of
              Website/Applications, customer information, etc.
            </Text>
              <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}
          >
            Vulnerability and Risk Mitigation
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              We have multi-layered security controls to our
              Website/Applications, products and services offered by us. We
              investigate all credible reports of cybersecurity vulnerabilities
              that may affect our products or services. If you believe that you
              have information about a potential cybersecurity vulnerability
              related our Website/Applications or products or services offered
              by us, please notify us by sending an email to
              support@rideriver.com
            </Text>
              <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}
          >
            Software updates for Vehicle and App
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              River Mobility reserves the right to update the firmware of your
              scooter and make updates to the accompanying mobile application as
              part of ongoing efforts to improve product performance, security,
              and user experience. By using the product , you agree to our
              T&C's, also you consent to the automatic installation of these
              updates, which may be delivered remotely or through the App, and
              acknowledge that these updates are essential for the optimal
              functioning of the scooter. River Mobility does not guarantee that
              older versions of firmware or App will continue to be supported or
              function properly after updates are implemented.
            </Text>

            <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
            Dealerships and Distributorships
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              If you are approached by any person or organisation(s) claiming to
              sell our scooter through any website / phone call / poster /
              social media post / whatsapp forward, we urge you to inform the
              local police and / or report it to support@rideriver.com The
              official website for River Mobility Private Limited is
              https://www.rideriver.com/. River Mobility Private Limited is not
              accepting deposits, advances or tokens in relation to any
              distributorships or dealerships. Please note that our Company will
              not be responsible or liable for any loss or damage, whether
              direct or indirect, suffered by anyone due to the use of or
              dealing with such fake websites / emails / communications. If you
              have any queries or concerns, reach out to us at
              support@rideriver.com or call us at 9731158443
            </Text>
             <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
            Vendor Partners
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              As a vendor partner, we expect you to adhere to our terms and
              conditions. Please click on the link to read the full version of
              our terms and conditions. Vendor Terms and Conditions- link If you
              have any queries or concerns, reach out to us at
              support@rideriver.com or call us at 9731158443
            </Text>
              <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
            Shipping and Deliveries
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              We will be delivering all our vehicles from our showrooms located
              at different locations. Your estimated delivery dates will be
              updated in your River account based our your booking slots. Your
              will have to visit your allocated showroom to take the delivery of
              your allocated vehicle. Once the vehicle RTO registration is
              completed you will get the delivery within 7-10 business days. For
              merchandise and accessories, we will dispatch the order within 3-5
              buisness days once the order is received and verified. If you have
              any queries or concerns, reach out to us at support@rideriver.com
              or call us at 9731158443
            </Text>
             <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
            Disclaimer of Warranties and Liabilities
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              We expressly disclaim any warranties or representations (express
              or implied) in respect of quality, suitability, accuracy,
              reliability, completeness, timeliness, performance, safety,
              merchantability, fitness for a particular purpose, or legality of
              the products listed or displayed or the content (including product
              information and/or specifications) on the website. While we have
              taken precautions to avoid inaccuracies in content, this
              Website/Applications, all content, information, software,
              products, services and related graphics are provided as is,
              without warranty of any kind. You hereby expressly release Company
              and/or its affiliates and/or any of its officers and
              representatives from any cost, damage, liability or other
              consequence of any of the actions/inactions of the vendors and
              specifically waiver any claims or demands that you may have in
              this behalf under any statute, contract or otherwise. Identifying
              any kind of vulnerability may not entail us to reward you.
              However, the same shall be subject to Company’s sole discretion
              and policies.
            </Text>
            
            
            <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
            Communication Consent
            </Text>
            <Text
              className="text-base text-river-blue-5 mb-6"
              style={Typography.copy1}
            >
              When you visit www.rideriver.com or send emails to us, you are
              communicating with us electronically. We may communicate with you
              by email, SMS, WhatsApp, phone call or by posting notices on the
              website or by any other mode of communication. For contractual
              purposes, you consent to receive communications including SMS,
              e-mail, WhatsApp or phone calls from us. In furtherance to your
              usage of the Website/Application, you expressly waive the Do Not
              Call (DNC) / Do Not Disturb (DND) registrations on your
              phone/mobile numbers for contacting you for such purpose and
              usage. Hence, there will be no DNC / DND check required for the
              number you may have left on our Website. Such modes of contacting
              you may include sending SMSs and/ or telephonic calls.
            </Text>
          
           <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
          Amendments to the Conditions or Changes in Service Agreement
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            We reserve the right to make changes to our Website/Applications,
            policies, and these Conditions of Use at any time. You will be
            subject to the policies and Conditions of Use in force at the time
            that you use the Website/Applications, unless any change to those
            policies or these conditions is required to be made by law or
            government authority. If any of these conditions is deemed invalid,
            void, or for any reason unenforceable, that condition will be deemed
            severable and will not affect the validity and enforceability of any
            remaining condition.
          </Text>
           <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
          Events beyond our reasonable control
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            We will not be held responsible for any delay or failure to comply
            with our obligations under these conditions if the delay or failure
            arises from any cause which is beyond our reasonable control. This
            condition does not affect your statutory rights.
          </Text>
           <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
          Governing law and Jurisdiction
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            These conditions are governed by and construed in accordance with
            the laws of India. You agree, as we do, to submit to the exclusive
            jurisdiction of the courts at Bengaluru. IN NO EVENT SHALL RIVER
            MOBILITY PVT LTD BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT OR
            CONSEQUENTIAL DAMAGES OF ANY KIND IN CONNECTION WITH THESE TERMS OF
            USE, EVEN IF USER HAS BEEN INFORMED IN ADVANCE OF THE POSSIBILITY OF
            SUCH DAMAGES.
          </Text>
                   <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
          Contact Information
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            This site is owned and operated by River Mobility Pvt Ltd. If You
            have any have any question, issue, complaint regarding any of our
            Services, please contact support@rideriver.com
          </Text>
            <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
          Photography and Videography
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            All the events organised by River Mobility Pvt Ltd, and feedback
            received therein may be recorded and photographed. All rights to
            edit and publish the aforesaid subsists with River Mobility Pvt Ltd.
          </Text>
           <Text
            className="text-river-blue-5 mb-4"
            style={ Typography.subline1}>
          Right to Refusal
          </Text>
          <Text
            className="text-base text-river-blue-5 mb-6"
            style={Typography.copy1}
          >
            “The Company reserves the right to refuse permission to You to
            participate in any activity organised by the company, at its
            discretion without assigning any reasons whatsoever. Further the
            Company reserves the right to re-schedule, cancel or amend the terms
            governing activities, at its discretion without any prior written
            notice/intimation.” “Each order placed on this Website/Applications
            constitutes an offer to purchase products. Orders are subject to
            Company’s acceptance and may be refused at Company’s discretion.”
          </Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
