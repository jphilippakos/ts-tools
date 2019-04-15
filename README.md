# ts-utils
Handy utilities for typescript projects

TsMapper:
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
      
COMING SOON : ts-merge (typesafe alternative to Object.assign)
