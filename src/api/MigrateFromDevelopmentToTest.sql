select * 
from Development.species
left join Test.species
on Development.species.spec_name = Test.species.spec_name
where Test.species.spec_name is null;

select * 
from Development.specimen as d
left join Test.specimen as t
on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
where Test.specimen.uid is null;

select * from Development.model
left join Test.model
on Development.model.uid = Test.model.uid
where Test.model.uid is null;

select * 
from Development.image_set as d
left join Test.image_set as t
on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
where t.spec_name is null;

select * from Development.annotations
left join Test.annotations
on Development.annotations.annotation_id = Test.annotations.annotation_id
where Test.annotations.annotation_id is null;