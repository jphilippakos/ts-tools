# ts-utils
Handy utilities for typescript projects

### TsMapper:
   maps from a source object to a target class
   
    interface ISource { firstName: string; lastName: string; dob: string; favoriteColor: string;}
    interface ITarget { name: string; dob: Date; favoriteColor: string; }
    class Target implements ITarget {
      public name: string;
      public dob: Date;
      public favoriteColor: string = 'green'
    }
    
    const mapper = new TsMapper<ITarget, ISource>(Target)
      .prop('name', src => src.firstName + ' ' + src.lastName)
      .prop('date', src => (src, prop) => new Date(src[prop]))
      .copy(['favoriteColor'])
      .mappedPropsOnly();
      
    let result = mapper.map({ 
      firstName: 'John',
      lastName: 'Doe',
      dob: 'January 1, 1980',
      favoriteColor: 'red'
    });
    
Alternatively, for the same outcome:
    
     const mapper = new TsMapper<ITarget, ISource>(Target)
      .prop('name', src => src.firstName + ' ' + src.lastName)
      .prop('date', src => (src, prop) => new Date(src[prop]))
      .ignore('firstName', 'lastName');
      
To prevent overriding of default values (i.e keep green as favorite color):

    const mapper = new TsMapper<ITarget, ISource>(Target)
      .prop('name', src => src.firstName + ' ' + src.lastName)
      .prop('date', src => (src, prop) => new Date(src[prop]))
      .ignore('firstName', 'lastName');
      .cancelOverride()
      
### tsMerge
   A type safe version of Javascript's Object.assign. Useful for making changes to an object while maintaining immutability.
   This function takes one or more parameters. It will make a new instance of the first argument's parent class.
   It will then perform an Object.assign using this new object as the target, and all arguments as sources.
   All arguments following the first, must be partial matches of the target's type.
   
       class TargetType {
           get fullName() {
               return first + ' ' + last;
           }
      
           constructor(public first: string, public last: string) { }
       }
  
       const original = new TargetType('John', 'Doe');
       const altered = tsMerge(original, { first: 'Jane' });
   
   
