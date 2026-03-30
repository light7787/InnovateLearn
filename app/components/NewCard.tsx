import { MaterialCommunityIcons } from '@expo/vector-icons'; // Using MaterialCommunityIcons for example
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

const NewCard = () => {
  return (
    <PaperProvider>
      <View style={styles.cardContainer}>
        {/* Frame 1000003908 */}
        <View style={styles.frame3908}>
          {/* Frame 1000003907 */}
          <View style={styles.frame3907}>
            {/* Frame 1000003899 */}
            <View style={styles.frame3899}>
              {/* Frame 1000003897 */}
              <View style={styles.frame3897}>
                <Text style={styles.leadName}>Lead Name</Text>
                <Text style={styles.leadAge}>Lead Age: 001</Text>
              </View>

              {/* Frame 1000003898 (Servicing Status - Warm) */}
              <View style={styles.servicingStatusWarm}>
                <Text style={styles.warmText}>Warm</Text>
              </View>
            </View>

            {/* Line 11 */}
            <View style={styles.line11} />

            {/* Frame 1000003906 */}
            <View style={styles.frame3906}>
              {/* Frame 1000004015 */}
              <View style={styles.frame4015}>
                {/* Frame 1000003895 */}
                <View style={styles.frame3895}>
                  <Text style={styles.customerAsked}>Customer Asked to Follow Up Late..</Text>
                  <Text style={styles.lastFollowUpRemark}>Last Follow-Up Remark</Text>
                </View>
              </View>

              {/* Line 10 (Vertical Separator) */}
              <View style={styles.line10Vertical} />

              {/* Frame 1000004017 */}
              <View style={styles.frame4017}>
                {/* Frame 1000003900 */}
                <View style={styles.frame3900}>
                  <Text style={styles.dateText}>10 May, 10:30 AM</Text>
                  <Text style={styles.upcomingFollowUp}>Upcoming Follow-Up</Text>
                </View>
              </View>
            </View>

            {/* Frame 1000003908 (Follow-Up Type) */}
            <View style={styles.followUpTypeContainer}>
              <Text style={styles.followUpTypeText}>Follow-Up Type:</Text>
              {/* Servicing_Status (Reschedule TR Call) */}
              <View style={styles.rescheduleTRCall}>
                <Text style={styles.rescheduleTRCallText}>Reschedule TR Call</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Frame 1000004068 (View details) */}
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>View details</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#00405D" style={styles.arrowIcon} />
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 16,
    width: 342,
    height: 270,
    backgroundColor: '#DEEEF6', // River Blue/02
    borderRadius: 16,
  },
  frame3908: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 16,
    width: 310,
    height: 212,
    alignSelf: 'stretch',
  },
  frame3907: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    width: 310,
    height: 212,
    alignSelf: 'stretch',
  },
  frame3899: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    gap: 148,
    width: 310,
    height: 80,
    alignSelf: 'stretch',
  },
  frame3897: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 8,
    width: 120,
    height: 50,
  },
  leadName: {
    width: 120,
    height: 24,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#00405D', // River Blue/06
  },
  leadAge: {
    width: 120,
    height: 18,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#007DB6', // River Blue/05
  },
  servicingStatusWarm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 16,
    gap: 10,
    width: 49,
    height: 24,
    backgroundColor: '#FFC500', // Rating yellow
    borderRadius: 30,
  },
  warmText: {
    width: 33,
    height: 18,
    fontFamily: 'Söhne',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    color: '#F7FBFD', // River Blue/01
    textAlign: 'center',
  },
  line11: {
    width: 310,
    height: 0,
    borderWidth: 1,
    borderColor: '#61AFD2', // River Blue/04
    alignSelf: 'stretch',
  },
  frame3906: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 16,
    width: 310,
    height: 108,
    alignSelf: 'stretch',
  },
  frame4015: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    gap: 16,
    width: 135,
    height: 58,
    flexGrow: 1,
  },
  frame3895: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    gap: 4,
    width: 142,
    height: 58,
  },
  customerAsked: {
    width: 142,
    height: 36,
    fontFamily: 'Söhne Breit',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#00405D', // River Blue/06
    textAlign: 'center',
  },
  lastFollowUpRemark: {
    width: 142,
    height: 18,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#007DB6', // River Blue/05
    textAlign: 'center',
  },
  line10Vertical: {
    width: 0,
    height: 80, // Approximate height based on design
    borderWidth: 1,
    borderColor: '#61AFD2', // River Blue/04
    transform: [{ rotate: '90deg' }], // This is tricky in RN, usually done with width/height and positioning
    // For a vertical line, you'd typically set width to 1 and height to the desired length.
    // The Figma transform: rotate(90deg) on a 0px height line implies it's meant to be a vertical separator.
    // So, we'll make it a 1px width and a height that visually separates the content.
    // Adjust as needed to match visual
  },
  frame4017: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    gap: 16,
    width: 135,
    height: 58,
    flexGrow: 1,
  },
  frame3900: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    gap: 4,
    width: 135,
    height: 46,
    alignSelf: 'stretch',
  },
  dateText: {
    width: 127,
    height: 24,
    fontFamily: 'Söhne Breit',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#00405D', // River Blue/06
    textAlign: 'center',
  },
  upcomingFollowUp: {
    width: 135,
    height: 18,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#007DB6', // River Blue/05
    textAlign: 'center',
  },
  followUpTypeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    gap: 10,
    width: 310,
    height: 24,
    alignSelf: 'stretch',
  },
  followUpTypeText: {
    width: 99,
    height: 18,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    color: '#00405D', // River Blue/06
  },
  rescheduleTRCall: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 16,
    gap: 10,
    width: 177,
    height: 24,
    backgroundColor: '#F3776C', // River Red/04
    borderRadius: 30,
  },
  rescheduleTRCallText: {
    width: 105,
    height: 18,
    fontFamily: 'Söhne',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    color: '#F7FBFD', // River Blue/01
    textAlign: 'center',
  },
  viewDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    gap: 16,
    width: 310,
    height: 18,
    alignSelf: 'stretch',
  },
  viewDetailsText: {
    width: 75,
    height: 18,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    color: '#00405D', // River Blue/06
  },
  arrowIcon: {
    transform: [{ scaleX: -1 }], // To mirror the arrow icon if needed, depending on the icon used
  },
});

export default NewCard;
