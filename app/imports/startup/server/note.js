import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Notes } from '../../api/note/note';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.lastName} (${data.owner})`);
  Notes.insert(data);
}

/** Initialize the collection if empty. */
if (Notes.find().count() === 0) {
  if (Meteor.settings.defaultContacts) {
    console.log('Creating no default data.');
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Notes', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Notes.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('NotesAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Notes.find();
  }
  return this.ready();
});
